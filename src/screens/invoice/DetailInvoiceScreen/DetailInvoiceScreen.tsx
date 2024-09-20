import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, View} from 'react-native';

import {globalStyles} from '@styles';
import TextComponent from '@components/TextComponent';
import {DetailInvoiceScreenProps} from '@models/navigators/HomNavigator';
import {DetailInvoiceResponseModel} from '@models/invoices';
import {invoiceService} from '@services';
import moment from 'moment';
import {
  DATE_PICKER_FORMAT,
  MONEY_FORMAT_BY,
  MONTH_PICKER_FORMAT,
} from '@const/index';
import {ErrorResponseAxios} from '@models/error';
import TitleComponent from '@components/TitleComponent';
import {ScrollView} from 'react-native-gesture-handler';
import {styles} from './styles';
import InvoiceStateTag from '@components/InvoiceStateTag';
import ButtonComponent from '@components/ButtonComponent';
import {appColors} from '@const/appColors';
import PayModal from '../components/PayModal';
import PartialPaidModal from '../components/PartialPaidModal';
import RevokePayModal from '../components/RevokePayModal';
import AccommodationInformation from './components/AccommodationInformation';
import TenantInformation from './components/TenantInformation';
import {Can} from '@context';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {Button} from '@ant-design/react-native';

const DetailInvoiceScreen: React.FC<DetailInvoiceScreenProps> = ({route}) => {
  const {t} = useTranslation();
  const invoiceId = route.params.invoiceId;
  const accommodationId = route.params.accommodationId;
  const roomId = route.params.roomId;
  const [detailInvoice, setDetailInvoice] =
    useState<DetailInvoiceResponseModel>();
  const [openPayModal, setOpenPayModal] = useState(false);
  const [openPartialPaidModal, setOpenPartialPaidModal] = useState(false);
  const [openRevokePayModal, setOpenRevokePayModal] = useState(false);

  useEffect(() => {
    const getDetailInvoiceById = async () => {
      try {
        const resData = await invoiceService.getDetailInvoice(invoiceId);

        //sort service
        const isPrimaryService = (serviceName: string) => {
          if (
            serviceName === 'rentalCost' ||
            serviceName === 'electric' ||
            serviceName === 'water'
          ) {
            return true;
          } else {
            return false;
          }
        };
        resData.items?.sort((a, b) => {
          if (isPrimaryService(a.name) && !isPrimaryService(b.name)) {
            return -1;
          } else if (!isPrimaryService(a.name) && isPrimaryService(b.name)) {
            return 1;
          }
          return b.cost - a.cost;
        });
        setDetailInvoice(resData);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      }
    };

    getDetailInvoiceById();
  }, [invoiceId]);

  return (
    <View style={globalStyles.container}>
      <TitleComponent
        back
        title={t('screensTitle.invoice')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerInvoice}>
            <View style={styles.headerInvoiceItemCenter}>
              <TextComponent styles={[styles.itemTitle, styles.upSize]}>
                {t('invoice.invoiceTitle')}
              </TextComponent>
            </View>
          </View>
          <View>
            <View style={styles.headerInvoice}>
              <View style={styles.headerInvoiceItemCenter}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.invoiceDate')}
                </TextComponent>
              </View>
              <View style={styles.headerInvoiceItemCenter}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.dueDate')}
                </TextComponent>
              </View>
            </View>
            <View style={styles.headerInvoice}>
              <View style={styles.headerInvoiceItemCenter}>
                <TextComponent styles={styles.itemText}>{`${moment(
                  detailInvoice?.invoiceDate,
                ).format(MONTH_PICKER_FORMAT)}`}</TextComponent>
              </View>
              <View style={styles.headerInvoiceItemCenter}>
                <TextComponent styles={styles.itemText}>{`${moment(
                  detailInvoice?.dueDate,
                ).format(DATE_PICKER_FORMAT)}`}</TextComponent>
              </View>
            </View>
          </View>
          <View style={styles.line} />
          <AccommodationInformation accommodationId={accommodationId || ''} />
          <View style={styles.lineContent} />
          <TenantInformation
            roomId={roomId || ''}
            tenants={detailInvoice?.tenants || []}
          />
          <View style={styles.lineContent} />
          <View style={{marginTop: 8}}>
            <View style={styles.headerInvoice}>
              <View style={styles.headerInvoiceItemLeft}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.invoiceName')}
                </TextComponent>
              </View>
              <View style={styles.headerInvoiceItemRight}>
                <InvoiceStateTag state={detailInvoice?.state} />
              </View>
            </View>
            <View style={styles.headerInvoice}>
              <View style={styles.headerInvoiceItemLeft}>
                <TextComponent styles={styles.itemText}>
                  {detailInvoice?.name}
                </TextComponent>
              </View>
            </View>
          </View>
          <View style={[styles.headerInvoice, {marginTop: 16}]}>
            <View style={styles.headerInvoiceItemCenter}>
              <TextComponent styles={[styles.itemTitle, {fontSize: 20}]}>
                {'Chi tiết dịch vụ'}
              </TextComponent>
            </View>
          </View>
          <View>
            {detailInvoice?.items.map((item, index) => (
              <View key={index}>
                <View style={styles.lineContent} />
                <View style={styles.contentInvoice}>
                  <View style={styles.contentInvoiceItemLeft}>
                    <TextComponent styles={styles.itemText}>
                      {t(`service.${item.name}.name`)}
                    </TextComponent>
                  </View>
                  <View style={styles.contentInvoiceItemRight}>
                    <TextComponent styles={styles.itemText}>
                      {t('label.amount')}
                    </TextComponent>
                  </View>
                </View>
                <View style={styles.contentInvoice}>
                  <View style={styles.contentInvoiceItemLeft}>
                    <TextComponent styles={styles.itemText}>
                      {item.quantity}{' '}
                      {t(`service.${item.name}.unit.${item.unit}`)} x{' '}
                      {`${item.cost}`.replace(MONEY_FORMAT_BY, ',')}
                    </TextComponent>
                  </View>
                  <View style={styles.contentInvoiceItemRight}>
                    <TextComponent styles={styles.itemText}>
                      {`${item.cost * item.quantity}`.replace(
                        MONEY_FORMAT_BY,
                        ',',
                      )}
                    </TextComponent>
                  </View>
                </View>
                {(item.name === 'electric' ||
                  (item.name === 'water' && item.unit === 'm3')) && (
                  <View style={styles.contentInvoice}>
                    <View style={styles.contentInvoiceItemLeft}>
                      <TextComponent
                        styles={{fontSize: 14, fontWeight: 'bold'}}>
                        {'('}
                        {t('placeholders.oldIndicator')}
                        {': '}
                      </TextComponent>
                      <TextComponent styles={{fontSize: 14}}>
                        {item.meta?.oldIndicator
                          ? item.meta?.oldIndicator
                          : '_'}
                        {' - '}
                      </TextComponent>
                      <TextComponent
                        styles={{fontSize: 14, fontWeight: 'bold'}}>
                        {t('placeholders.newIndicator')}
                        {': '}
                      </TextComponent>
                      <TextComponent styles={{fontSize: 14}}>
                        {item.meta?.newIndicator
                          ? item.meta?.newIndicator
                          : '_'}
                        {')'}
                      </TextComponent>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
          <View>
            {detailInvoice?.others?.map((item, index) => (
              <View key={index}>
                <View style={styles.lineContent} />
                <View style={styles.contentInvoice}>
                  <View style={styles.contentInvoiceItemLeft}>
                    <TextComponent styles={styles.itemText}>
                      {item.name}
                    </TextComponent>
                  </View>
                  <View style={styles.contentInvoiceItemRight}>
                    <TextComponent styles={styles.itemText}>
                      {t('label.amount')}
                    </TextComponent>
                  </View>
                </View>
                <View style={styles.contentInvoice}>
                  <View style={styles.contentInvoiceItemLeft}>
                    <TextComponent styles={styles.itemText}>
                      {item.quantity}{' '}
                      x{' '}
                      {`${item.cost}`.replace(MONEY_FORMAT_BY, ',')}
                    </TextComponent>
                  </View>
                  <View style={styles.contentInvoiceItemRight}>
                    <TextComponent styles={styles.itemText}>
                      {`${item.cost * item.quantity}`.replace(
                        MONEY_FORMAT_BY,
                        ',',
                      )}
                    </TextComponent>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.line} />
          <View>
            <View style={styles.contentInvoice}>
              <View style={styles.contentInvoiceItemRight}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.totalAmount')}:
                </TextComponent>
              </View>
              <View style={styles.contentInvoiceItemRight}>
                <TextComponent styles={styles.itemTitle}>
                  {`${detailInvoice?.amountAfterPromotion}`.replace(MONEY_FORMAT_BY, ',')}
                </TextComponent>
              </View>
            </View>
            <View style={styles.contentInvoice}>
              <View style={styles.contentInvoiceItemRight}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.amountPaid')}:
                </TextComponent>
              </View>
              <View style={styles.contentInvoiceItemRight}>
                <TextComponent styles={styles.itemTitle}>
                  {`${detailInvoice?.amountPaid}`.replace(MONEY_FORMAT_BY, ',')}
                </TextComponent>
              </View>
            </View>
            <View style={styles.contentInvoice}>
              <View style={styles.contentInvoiceItemRight}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.amountToPay')}:
                </TextComponent>
              </View>
              <View style={styles.contentInvoiceItemRight}>
                <TextComponent styles={styles.itemTitle}>
                  {`${detailInvoice ? detailInvoice.amountAfterPromotion - detailInvoice.amountPaid : 0}`.replace(
                    MONEY_FORMAT_BY,
                    ','
                  )}
                </TextComponent>
              </View>
            </View>
          </View>

          <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.INVOICE}>
            {detailInvoice?.state === 'PAID' ? (
              <View style={styles.footerInvoice}>
                <View style={{flex: 1}}>
                  <ButtonComponent
                    text={t('actions.revoke')}
                    onPress={() => setOpenRevokePayModal(true)}
                    type="action"
                    styles={{
                      backgroundColor: 'white',
                      borderColor: appColors.primary,
                      borderWidth: 1,
                      justifyContent: 'center',
                    }}
                    textColor={appColors.primary}
                  />
                </View>
              </View>
            ) : (
              <View style={{marginTop: 8, rowGap: 8}}>
                <Button
                  type="ghost"
                  onPress={() => setOpenPartialPaidModal(true)}>
                  {t('actions.partialPaid')}
                </Button>
                <Button type="primary" onPress={() => setOpenPayModal(true)}>
                  {t('actions.paid')}
                </Button>
              </View>
            )}
          </Can>
        </View>

        {openPayModal && (
          <PayModal
            invoiceId={invoiceId}
            openPayModal={openPayModal}
            setOpenPayModal={setOpenPayModal}
            setDetailInvoice={setDetailInvoice}
          />
        )}
        {openPartialPaidModal && (
          <PartialPaidModal
            invoiceId={invoiceId}
            openPartialPaidModal={openPartialPaidModal}
            setOpenPartialPaidModal={setOpenPartialPaidModal}
            detailInvoice={detailInvoice}
            setDetailInvoice={setDetailInvoice}
          />
        )}
        {openRevokePayModal && (
          <RevokePayModal
            invoiceId={invoiceId}
            openRevokePayModal={openRevokePayModal}
            setOpenRevokePayModal={setOpenRevokePayModal}
            setDetailInvoice={setDetailInvoice}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default DetailInvoiceScreen;
