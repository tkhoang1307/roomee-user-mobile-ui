import {
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';

import {UserContext} from '@context';
import {UserRoles} from '@const/user';
import useDateTime from '@hk/useDateTime';
import {appColors} from '@const/appColors';
import AddComment from './components/AddComment';
import {fontFamilies} from '@const/fontFamilies';
import Comment from '@components/request/Comment';
import {useComments} from '@hk/request/useComment';
import StatusSelect from './components/StatusSelect';
import TextComponent from '@components/TextComponent';
import TitleComponent from '@components/TitleComponent';
import {RequestStatus, RequestType} from '@models/request';
import {useDetailRequest} from '@hk/request/useDetailRequest';
import {useRequestStatus} from '@hk/request/useRequestStatus';
import ExpenseRequest from '@components/request/ExpenseRequest';
import RequestStatusTag from '@components/request/RequestStatusTag';
import {DetailRequestScreenProps} from '@models/navigators/HomNavigator';
import ServiceRequest from '@components/request/ServicesRequest';
import {ImagePreview} from 'react-native-images-preview';

const DetailRequestScreen: React.FC<DetailRequestScreenProps> = ({route}) => {
  const {t} = useTranslation();
  const topicId = route.params.topicId;
  const roomName = route.params.roomName;
  const accomName = route.params.accomName;
  const {userState} = useContext(UserContext);
  const {loading, request, setRequest} = useDetailRequest(
    topicId,
    route.params.request,
  );
  const {comments, commentsLoading} = useComments({
    requestId: request?.id || '',
  });
  const cmtsRef = useRef<FlatList>(null);
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.CREATED);
  const {statusLoading, onRequestStatusChanged} = useRequestStatus({
    requestId: topicId,
  });
  const [showFooter, setShowFooter] = useState(true);
  const {timeFromNow} = useDateTime(
    request?.createdAt || new Date().toISOString(),
  );
  const imgSize = useMemo(() => {
    return Dimensions.get('screen').width / 4 - 14;
  }, []);

  useEffect(() => {
    if (route.params.request) setRequest(route.params.request);
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (cmtsRef) cmtsRef.current?.scrollToEnd();
  //   }, 1000);
  // }, [comments]);

  useEffect(() => {
    if (request) setStatus(request.status);
  }, [request]);

  useEffect(() => {
    if (request) {
      setRequest(r => {
        if (r) return {...r, status: status};
        return r;
      });
      onRequestStatusChanged(status);
    }
  }, [status]);

  return (
    <View style={{rowGap: 4, flex: 1}}>
      <TitleComponent
        back
        backgroundColor={appColors.backgroundCard}
        title={`${t('request.label')}${
          roomName ? ` - ${t('label.room')} ${roomName}` : ''
        }${accomName ? ` - ${t('label.accommodation')} ${accomName}` : ''}`}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />
      {loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: '100%',
          }}>
          <ActivityIndicator size={30} color={appColors.primary} />
        </View>
      )}
      <View style={{flex: 1}}>
        {!loading && request && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#fffffe',
              paddingTop: 8,
              rowGap: 8,
            }}>
            {/* comments */}
            <FlatList
              ref={cmtsRef}
              data={comments}
              keyExtractor={c => c.createdAt}
              renderItem={({item}) => <Comment comment={item} key={item.id} />}
              ListHeaderComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: '#fffffe',
                    paddingTop: 8,
                    rowGap: 8,
                  }}>
                  {/* requester */}
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: 12,
                      alignItems: 'center',
                      paddingHorizontal: 8,
                    }}>
                    <Image
                      source={{uri: request.theme}}
                      style={{width: 40, height: 40, borderRadius: 20}}
                    />
                    <View>
                      <TextComponent>{request.creator?.name}</TextComponent>
                      <View
                        style={{
                          flexDirection: 'row',
                          columnGap: 8,
                          alignItems: 'center',
                        }}>
                        <TextComponent color={appColors.gray}>
                          {timeFromNow}
                        </TextComponent>
                        <View
                          style={{
                            width: 1,
                            borderRightWidth: 1,
                            borderColor: appColors.gray,
                            height: '90%',
                          }}
                        />

                        <TextComponent color={appColors.gray}>
                          {moment(request.createdAt).format('hh:mm A')}
                        </TextComponent>
                      </View>
                    </View>
                  </View>

                  {/* icon and type */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 8,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        columnGap: 12,
                      }}>
                      <View style={{width: 40, alignItems: 'center'}}>
                        <Icon
                          name={
                            request.type === RequestType.SERVICE
                              ? 'toolbox-outline'
                              : request.type === RequestType.ROOM_REPAIR
                              ? 'wrench-outline'
                              : 'face-agent'
                          }
                          color={appColors.black}
                          size={20}
                        />
                      </View>
                      <TextComponent font={fontFamilies.bold}>
                        {t(`request.type.${request.type}`)}
                      </TextComponent>
                    </View>
                    {/* status */}

                    {userState.role === UserRoles.MANAGER ||
                    userState.role === UserRoles.OWNER ? (
                      <>
                        <StatusSelect
                          value={status}
                          setValue={setStatus}
                          type="select"
                          loading={statusLoading}
                        />
                      </>
                    ) : (
                      <RequestStatusTag status={request.status} />
                    )}
                  </View>

                  {/* content */}
                  <View style={{minHeight: 20, paddingHorizontal: 12}}>
                    <TextComponent color={appColors.gray}>
                      {t('label.description') + ':'}
                    </TextComponent>
                    <TextComponent>{request.description}</TextComponent>
                  </View>

                  {/* expense */}
                  {request.type === RequestType.ROOM_REPAIR && (
                    <ExpenseRequest
                      request={request}
                      setRequest={setRequest}
                      setShowFooter={setShowFooter}
                    />
                  )}

                  {/* services */}
                  {request.type === RequestType.SERVICE && (
                    <ServiceRequest request={request} />
                  )}

                  {/* images */}
                  {request.attachments?.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        columnGap: 10,
                        rowGap: 10,
                        flexWrap: 'wrap',
                        paddingHorizontal: 12,
                      }}>
                      {request.attachments?.map(f => (
                        <View key={f} style={{}}>
                          <ImagePreview
                            imageSource={{uri: f}}
                            imageStyle={{
                              width: imgSize,
                              height: imgSize,
                              borderRadius: 12,
                              objectFit: 'contain',
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  {/* divider */}
                  <View
                    style={{
                      borderBottomColor: appColors.gray4,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      width: '100%',
                    }}
                  />

                  {/* total comments */}
                  <View style={{alignItems: 'center'}}>
                    <TextComponent color={appColors.gray}>
                      {t('request.comments') +
                        `${comments.length > 0 ? ` (${comments.length})` : ''}`}
                    </TextComponent>
                  </View>

                  <View
                    style={{
                      borderBottomColor: appColors.gray4,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      width: '100%',
                    }}
                  />
                </View>
              }
              ListEmptyComponent={
                <View
                  style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!commentsLoading && (
                    <TextComponent>{t('request.emptyComments')}</TextComponent>
                  )}
                  {commentsLoading && (
                    <ActivityIndicator size={30} color={appColors.primary} />
                  )}
                </View>
              }
              contentContainerStyle={{
                flexGrow: 1,
                rowGap: 6,
                paddingVertical: 4,
                paddingBottom: 8,
              }}
              style={{marginTop: -5}}
            />
          </View>
        )}
      </View>
      {showFooter && <AddComment requestId={request?.id || ''} />}
    </View>
  );
};

export default DetailRequestScreen;
