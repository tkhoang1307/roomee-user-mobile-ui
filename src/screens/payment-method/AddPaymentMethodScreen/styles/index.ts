import { appColors } from '@const/appColors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    flexContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        columnGap: 16,
        justifyContent: 'space-between'
    },
    card: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        paddingTop: 8,
        paddingBottom: 6,
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 5,
        marginBottom: 4,
    },
    text: {
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    containerContent: {
        flex: 1,
        margin: 8,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    textAreaContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: appColors.gray2,
        width: '100%',
        padding: 5
    },
    textArea: {
        height: 100,
    },
});

