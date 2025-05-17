import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, Image } from "@react-pdf/renderer";
import fontOpenSans from "../../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf";
import fontOpenSansSemiBold from "../../assets/fonts/OpenSans_Condensed-SemiBold.ttf";
import fontOpenSansBold from "../../assets/fonts/OpenSans_SemiCondensed-Bold.ttf";

Font.register({
    family: "Open Sans",
    src: fontOpenSans,
});

Font.register({
    family: "Open Sans",
    src: fontOpenSansSemiBold,
    fontWeight: 'semibold'
})

Font.register({
    family: "Open Sans",
    src: fontOpenSansBold,
    fontWeight: 'bold'
})

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        lineHeight: 1.6,
        fontFamily: "Open Sans",
        backgroundColor: "#fff",
    },
    section: {
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        textTransform: "uppercase",
        color: "#1f2937",
    },
    label: {
        fontSize: 12,
        marginBottom: 2,
    },
    questionBlock: {
        marginBottom: 15,
    },
    questionText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#111827",
    },
    answer: {
        marginLeft: 12,
        fontSize: 11,
        marginBottom: 2,
    },
    answerSelect: {
        marginLeft: 12,
        fontSize: 11,
        marginBottom: 2,
        color: '#FF0000'
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    column: {
        flex: 1,
    },
    photoBox: {
        width: 100,
        height: 120,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        color: "#888",
    },
    image: {
        width: 100,
        height: 120,
        objectFit: "cover",
    },
    formLine: {
        flexDirection: "row",
        marginBottom: 4,
        fontSize: 10,
    },
    formLabel: {
        fontWeight: "bold",
        marginRight: '4px'
    },
    headerTitle: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: "bold",
        marginVertical: 10,
        textTransform: "uppercase",
    },
});

const PdfTemplate = ({
    name,
    birthday,
    companyName,
    position,
    image,
    answer
}) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.headerTitle}>BÀI KIỂM TRA AN TOÀN VỆ SINH LAO ĐỘNG</Text>
                <View style={styles.headerRow}>
                    <View style={styles.column}>
                        <View style={styles.formLine}>
                            <Text style={styles.formLabel}>Họ và tên:</Text>
                            <Text>{name || ""}</Text>
                        </View>
                        <View style={styles.formLine}>
                            <Text style={styles.formLabel}>Năm sinh:</Text>
                            <Text>{birthday || ""}</Text>
                        </View>
                        <View style={styles.formLine}>
                            <Text style={styles.formLabel}>Đơn vị:</Text>
                            <Text>{companyName || ""}</Text>
                        </View>
                        <View style={styles.formLine}>
                            <Text style={styles.formLabel}>Công việc đang làm:</Text>
                            <Text>{position || ""}</Text>
                        </View>
                    </View>
                    <View style={styles.photoBox}>
                        {image ? (
                            <Image src={image} style={styles.image} />
                        ) : (
                            <Text>Ảnh học viên</Text>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    {answer?.map((q, i) => (
                        <View key={i} style={styles.questionBlock}>
                            <Text style={styles.questionText}>{q?.title}</Text>
                            {q?.answers?.map((a, j) => (
                                <Text key={j} style={q?.dap_an === j + 1 ? styles.answerSelect : styles.answer}>
                                    {a}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    )
};

export default PdfTemplate;