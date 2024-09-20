import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import ImageModal from 'react-native-image-modal';
import {useContext, useMemo, useState} from 'react';
import {TextareaItem} from '@ant-design/react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DocumentPickerResponse} from 'react-native-document-picker';

import {UserContext} from '@context';
import {appColors} from '@const/appColors';
import UploadFile from '@components/UploadFile';
import UploadImage from '@components/UploadImage';
import {useAddComment} from '@hk/request/useComment';
import FileUploadCard from '@components/FileUploadCard';

interface AddCommentProps {
  requestId: string;
}

const AddComment: React.FC<AddCommentProps> = ({requestId}) => {
  const {t} = useTranslation();
  const {userState} = useContext(UserContext);
  const [comment, setComment] = useState('');
  const {addComment, loading} = useAddComment();
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>(
    [],
  );

  const imgSize = useMemo(() => {
    return Dimensions.get('screen').width / 4 - 12;
  }, []);

  const addNewComment = async () => {
    await addComment({
      comment: {
        name: userState.name,
        avatar: userState.imageUrl,
        createdAt: new Date().toISOString(),
        attachments: [],
        topicId: requestId,
        comment: comment,
        commenterId: userState.id,
      },
      selectedFiles,
      selectedImages,
      setSelectedFiles,
      setSelectedImages,
    });
    setComment('');
  };

  return (
    <View
      style={{
        backgroundColor: appColors.white,
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 16,
        rowGap: 9,
      }}>
      {selectedImages.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            columnGap: 10,
            rowGap: 10,
            flexWrap: 'wrap',
          }}>
          {selectedImages.map(f => (
            <View key={f.path}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedImages(prev =>
                    prev.filter(i => i.path !== f.path),
                  );
                }}
                style={{
                  position: 'absolute',
                  right: -9,
                  top: -9,
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: 'rgba(57, 52, 52, 0.8)',
                  zIndex: 100000000,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="close" size={20} color={appColors.white} />
              </TouchableOpacity>
              <ImageModal
                resizeMode="stretch"
                style={{
                  width: imgSize,
                  height: imgSize,
                  borderRadius: 12,
                }}
                source={{uri: f.path}}
                modalImageResizeMode="contain"
              />
            </View>
          ))}
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        {selectedFiles.length > 0 && (
          <View style={{rowGap: 8, paddingHorizontal: 4}}>
            {selectedFiles.map(f => (
              <FileUploadCard
                key={f.uri}
                file={f}
                setSelectedFiles={setSelectedFiles}
              />
            ))}
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',

          alignItems: 'flex-end',
          columnGap: 4,
        }}>
        <UploadImage
          selectedFiles={selectedImages}
          setSelectedFiles={setSelectedImages}
          options={{multiple: true}}>
          <View style={{minHeight: 45, justifyContent: 'center'}}>
            <Icon name={'camera-outline'} color={appColors.gray} size={30} />
          </View>
        </UploadImage>
        <UploadFile setSelectedFiles={setSelectedFiles}>
          <View style={{minHeight: 45, justifyContent: 'center'}}>
            <Icon name={'paperclip'} color={appColors.gray} size={30} />
          </View>
        </UploadFile>

        {/* comment */}
        <View style={{flexGrow: 1, flexShrink: 1}}>
          <TextareaItem
            rows={1}
            placeholder={t('request.writeComment')}
            autoHeight
            style={{
              borderRadius: 20,
              borderColor: appColors.gray,
              borderWidth: 1,
              paddingRight: 16,
              paddingLeft: 16,
            }}
            value={comment}
            onChange={c => setComment(c || '')}
          />
        </View>

        {/* send */}
        <TouchableOpacity
          // onPress={() => setOpenExtendModal(true)}
          style={{minHeight: 45, justifyContent: 'center'}}
          disabled={loading}
          onPress={() => addNewComment()}>
          {!loading ? (
            <Icon
              name={comment.length === 0 ? 'send-outline' : 'send'}
              color={appColors.primary}
              size={30}
            />
          ) : (
            <ActivityIndicator size={30} color={appColors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddComment;
