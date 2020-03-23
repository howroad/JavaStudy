package com.luhao.interface_validate;
import com.nstc.util.CastUtil;
import org.apache.commons.lang3.ThreadUtils;
import org.apache.commons.lang3.Validate;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>Title: RemoteParamValidator.java</p>
 * <p>Description: �ӿڲ���У����</p>
 * <p>Company: �����ź��ǿƼ��ɷ����޹�˾</p>
 *
 * @author luhao
 * @since 2020-03-14 11:16
 */
public class RemoteParamValidator extends DefaultHandler {

    private HashMap<String, List<RemoteParam>> remoteParamsMap;

    private List<RemoteParam> remoteParamList;

    private RemoteParam remoteParam;

    private final static String RULES = "rules";
    private final static String LIST_TAG = "remoteParams";
    private final static String PARAM_TAG = "remoteParam";
    public final static String RULES_DIR = "AIMS-CFG" + File.separator + "SPIC_REMOTE_RULES" + File.separator;

    private static RemoteParamValidator remoteParamValidator = null;

    private RemoteParamValidator() {
    }

    /**
     * ��������ģ��
     *
     * @param map
     * @param interfaceCode
     * @return
     */
    public Object buildModel(Map<String, Object> map, Class clazz, String interfaceCode) {
        Validate.notNull(map, "�����б�Ϊ�գ�");
        List<RemoteParam> remoteParams = remoteParamsMap.get(interfaceCode);
        if (remoteParams == null) {
            init();
        }
        Validate.notNull(remoteParams, "��ʼ��У����ʧ�ܣ��ӿڣ�" + interfaceCode);
        Object model = null;
        try {
            model = clazz.newInstance();
            for (RemoteParam param : remoteParams) {
                Object value = null;
                if (param.getType().startsWith("D")) {
                    value = CastUtil.toDate(map.get(param.getName()));
                } else if ((param.getType().startsWith("N") && param.getDecimalDigits() == null)) {
                    value = CastUtil.toInteger(map.get(param.getName()));
                } else if (param.getType().startsWith("N") && param.getDecimalDigits() != null) {
                    value = CastUtil.toDouble(map.get(param.getName()));
                } else {
                    value = CastUtil.toNotEmptyString(map.get(param.getName()));
                }
                FieldUtils.writeField(model, param.getFieldName(), value);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return model;
    }

    public static RemoteParamValidator getInstance() {
        if (remoteParamValidator == null) {
            remoteParamValidator = new RemoteParamValidator();
            remoteParamValidator.init();
        }
        return remoteParamValidator;
    }

    /**
     * У��Map���͵Ĳ���
     *
     * @param interfaceKey
     * @param map
     * @param sign
     */
    public void validate(String interfaceKey, Map<String, Object> map, String sign) {
        Validate.notEmpty(map, "�����б���Ϊ�գ�");
        List<RemoteParam> rules = rules(interfaceKey);
        Validate.notNull(rules, "�޷��ҵ��ӿ�" + interfaceKey);
        if (map.containsKey("DATA_LIST")) {
            List<Map<String, Object>> list = (List) (map.get("DATA_LIST"));
            validate(interfaceKey, list);
        } else {
            for (RemoteParam param : rules) {
                param.validate(map.get(param.getName()), sign);
            }
        }

    }

    /**
     * У��List���͵Ĳ���
     *
     * @param intefaceKey
     * @param list
     */
    public void validate(String intefaceKey, List<Map<String, Object>> list) {
        Validate.noNullElements(list, "�����б���Ϊ�գ�");
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> map = list.get(i);
            validate(intefaceKey, map, "��" + (i + 1) + "��");
        }
    }

    private List<RemoteParam> rules(String interfaceKey) {
        List<RemoteParam> rules = remoteParamsMap.get(interfaceKey);
        if (rules == null) {
            init();
        }
        rules = remoteParamsMap.get(interfaceKey);
        Validate.notNull(rules, "δ����Ľӿڣ�" + interfaceKey);
        return rules;
    }

    /**
     * ��ʼ��
     */
    public void init() {
        //1.��ȡSAXParserFactoryʵ��
        SAXParserFactory factory = SAXParserFactory.newInstance();
        //2.��ȡSAXparserʵ��
        SAXParser saxParser = null;
        try {
            saxParser = factory.newSAXParser();
            /*
            File dir = new File(ResourceLoader.getResource(RemoteParamValidator.RULES_DIR).getPath());
            if (dir != null && dir.isDirectory()) {
                File[] files = dir.listFiles(new FilenameFilter() {
                    @Override
                    public boolean accept(File dir, String name) {
                        return name.toLowerCase().endsWith(".xml");
                    }
                });
                for (File file : files) {
                    saxParser.parse(file, remoteParamValidator);
                }
            }
             */
            String path = System.getProperty("user.dir")+"/src/main/java/com/luhao/interface_validate/SPICII-1.xml";
            System.out.println(path);
            saxParser.parse(new File(path), remoteParamValidator);

        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes);
        if (RULES.equals(qName)) {
            remoteParamsMap = remoteParamsMap == null ? new HashMap<String, List<RemoteParam>>() : remoteParamsMap;
        } else if (LIST_TAG.equals(qName)) {
            remoteParamList = new ArrayList<RemoteParam>();
            remoteParamsMap.put(attributes.getValue(0), remoteParamList);
        } else if (PARAM_TAG.equals(qName)) {
            remoteParam = new RemoteParam(attributes);
            remoteParamList.add(remoteParam);
        }
    }

    public HashMap<String, List<RemoteParam>> getRemoteParamsMap() {
        return remoteParamsMap;
    }
}
