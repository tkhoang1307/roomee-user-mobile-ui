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
    footerInvoice: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 8,
        marginTop: 16,
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
});