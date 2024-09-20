import { appColors } from '@const/appColors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    upSize: {
        fontSize: 24,
    },
    headerInvoice: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 8
    },
    headerInvoiceItemCenter: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInvoiceItemLeft: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerInvoiceItemRight: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    contentInvoice: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 8
    },
    contentInvoiceItemLeft: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    contentInvoiceItemRight: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    contentInvoiceItemCenter: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    line: {
        borderBottomWidth: 1, 
        borderBottomColor: appColors.gray4,
        marginVertical: 10,
    },
    lineContent: {
        borderBottomWidth: 1, 
        borderBottomColor: appColors.gray5,
        marginVertical: 10,
    },
    amountContainer: {
        width: '100%',
    },
    contentInvoiceItemFlex3: {
        flex: 3, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    contentInvoiceItemFlex2: {
        flex: 2, 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export const invoiceCardStyles = StyleSheet.create({ 
    itemContainer: {
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        height: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 10,
        paddingLeft: 24,
    },
    itemText: {
        fontSize: 16,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
    },
    leftContainer: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
});

export const ServiceStepStyle = StyleSheet.create({
    textOverlaySecondServiceStyle: {
        fontSize: 16,
        width: 120,
        textAlignVertical: 'center',
        paddingLeft: 10,
        height: 40,
    },
    serviceViewStyle: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'flex-end',
    },
    unitContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        width: '100%',
        minHeight: 56,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: appColors.white,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 24,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
    },
    button: {
        borderRadius: 12,
        padding: 10,
        elevation: 2,
        marginTop: 20,
    },
    buttonClose: {
        backgroundColor: appColors.primary,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});