import { StyleSheet } from 'react-native';
import { appColors } from '@const/appColors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'green',
        margin: 20,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        margin: 10,
        textAlign: 'center',
    },
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
    hiddenContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 80,
    },
    hiddenButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: 80,
    },
    editButton: {},
    deleteButton: {},
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
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

export const ModalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '85%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export const SwitchButtonStyles = StyleSheet.create({
    switchContainer: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    switch: {

    },
    toggleClosedStyle: {
        backgroundColor: '#ff4d4f'
    },
    toggleCheckStyle: {
        backgroundColor: '#52c41a'
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