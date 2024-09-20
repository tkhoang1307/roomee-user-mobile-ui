import InputComponent from '@components/InputComponent';
import TextComponent from '@components/TextComponent';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {UserRoles} from '@const/user';
import {RequestsContext, UserContext} from '@context';
import {RequestModel, RequestType} from '@models/request';
import {requestService} from '@services';
import {globalStyles} from '@styles';
import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ExpenseRequestProps {
  request: RequestModel;
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>;
  setRequest: React.Dispatch<React.SetStateAction<RequestModel | undefined>>;
}

const ExpenseRequest: React.FC<ExpenseRequestProps> = ({
  request,
  setRequest,
  setShowFooter,
}) => {
  const {t} = useTranslation();
  const {userState} = useContext(UserContext);
  const {setRequests} = useContext(RequestsContext);
  const [expense, setExpense] = useState<string>('');
  const [openEditExpense, setOpenEditExpense] = useState(false);

  const onChangeExpense = async () => {
    const oldExpense = request?.meta.expense as number;
    const str = oldExpense.toString();
    const newExpenseStr = parseFloat(expense.replaceAll(',', '')) || 0;
    const newExpense = isNaN(newExpenseStr) ? 0 : newExpenseStr;

    try {
      requestService.updateRequestMetadata({
        topicId: request?.id || '',
        payload: {
          meta: {
            expense: newExpense,
          },
        },
      });
      setRequest(prev => ({...prev, meta: {expense: newExpense}} as any));
      setRequests(requests =>
        requests.map(r => {
          if (r.id === request?.id) {
            return {
              ...r,
              meta: {expense: newExpense},
            };
          }
          return r;
        }),
      );
    } catch (error) {
      setRequest(prev => ({...prev, meta: {expense: oldExpense}} as any));
      setExpense(str);
      setRequests(requests =>
        requests.map(r => {
          if (r.id === request?.id) {
            return {
              ...r,
              meta: {expense: oldExpense},
            };
          }
          return r;
        }),
      );
    } finally {
      setOpenEditExpense(false);
    }
  };

  useEffect(() => {
    if (request) {
      if (request.type === RequestType.ROOM_REPAIR) {
        setExpense(
          request.meta.expense
            ? new Intl.NumberFormat('ja-JP').format(request.meta.expense)
            : '0',
        );
      }
    }
  }, []);

  return (
    <>
      <View
        style={{
          minHeight: 20,
          paddingHorizontal: 12,
          flexDirection: 'row',
          columnGap: 8,
          alignItems: 'center',
        }}>
        <TextComponent color={appColors.gray}>
          {t('request.expense') + ':'}
        </TextComponent>
        {userState.role === UserRoles.MANAGER ||
        userState.role === UserRoles.OWNER ? (
          <>
            {(userState.role === UserRoles.MANAGER ||
              userState.role === UserRoles.OWNER) &&
              !openEditExpense && (
                <>
                  <TextComponent font={fontFamilies.bold}>
                    {`${new Intl.NumberFormat().format(
                      request.meta.expense,
                    )} ₫`}
                  </TextComponent>
                  <TouchableOpacity
                    style={{
                      ...globalStyles.iconButton,
                      height: 34,
                      width: 34,
                    }}
                    onPress={() => {
                      setExpense(
                        new Intl.NumberFormat().format(request.meta.expense),
                      );
                      setOpenEditExpense(true);
                    }}>
                    <Icon name="pencil" size={20} />
                  </TouchableOpacity>
                </>
              )}
            {openEditExpense && (
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 8,
                  alignItems: 'center',
                }}>
                <View>
                  <InputComponent
                    styleInput={{
                      marginTop: 0,
                      marginBottom: -24,
                      zIndex: 6,
                    }}
                    value={expense}
                    onChange={val => {
                      const numStr = parseFloat(val.replaceAll(',', '')) || '';
                      setExpense(
                        numStr ? new Intl.NumberFormat().format(numStr) : '',
                      );
                    }}
                    numeric
                    suffix={<TextComponent size={18}>₫</TextComponent>}
                    onFocus={() => setShowFooter(false)}
                    onBlur={() => setShowFooter(true)}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    ...globalStyles.iconButton,
                    height: 34,
                    width: 34,
                  }}
                  onPress={() => onChangeExpense()}>
                  <Icon name="check" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...globalStyles.iconButton,
                    height: 34,
                    width: 34,
                  }}
                  onPress={() => setOpenEditExpense(false)}>
                  <Icon name="window-close" size={20} />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <TextComponent font={fontFamilies.bold}>
            {`${request.meta.expense} ₫`}
          </TextComponent>
        )}
      </View>
      <View style={{minHeight: 20, paddingHorizontal: 12}}>
        <TextComponent color={appColors.gray}>
          {t('request.properties') + ':'}
        </TextComponent>
        {((request.meta.roomProperties as string[]) || [])?.map((p, i) => (
          <View
            key={i}
            style={{
              backgroundColor: '#FFF',
              borderBottomColor: '#E0E0E0',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 4,
            }}>
            <Icon name={'circle-medium'} color={appColors.black} size={20} />
            <TextComponent>{p}</TextComponent>
          </View>
        ))}
      </View>
    </>
  );
};

export default ExpenseRequest;
