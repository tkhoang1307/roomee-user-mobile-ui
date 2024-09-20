import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {Dimensions, Image, View} from 'react-native';

import FileCard from './FileCard';
import useDateTime from '@hk/useDateTime';
import {appColors} from '@const/appColors';
import {CommentModel} from '@models/request';
import {isImageUrl} from '@utils/stringHelpers';
import TextComponent from '@components/TextComponent';
import {ImagePreview} from 'react-native-images-preview';

interface CommentProps {
  comment: CommentModel;
}

const Comment: React.FC<CommentProps> = ({comment}) => {
  const [imgs, setImgs] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const {timeFromNow} = useDateTime(
    comment?.createdAt || new Date().toISOString(),
  );
  const imgSize = useMemo(() => {
    return Dimensions.get('screen').width / 4 - 14;
  }, []);

  useEffect(() => {
    const attachments = comment.attachments || [];
    const i: string[] = [];
    const f: string[] = [];
    attachments.forEach(s => {
      if (isImageUrl(s)) i.push(s);
      else f.push(s);
    });
    setImgs(i);
    setFiles(f);
  }, [comment]);

  return (
    <View
      style={{
        flexDirection: 'row',
        columnGap: 12,
        marginLeft: 8,
        paddingRight: 8,
      }}>
      <Image
        source={{uri: comment.avatar}}
        style={{width: 40, height: 40, borderRadius: 20}}
      />
      {/* commenter */}
      <View
        style={{
          padding: 8,
          rowGap: 4,
          backgroundColor: appColors.white,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 3,
          borderRadius: 8,
          flex: 1,
          marginRight: 3,
          marginTop: 1,
        }}>
        <TextComponent>{comment.name}</TextComponent>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 8,
            alignItems: 'center',
          }}>
          <TextComponent color={appColors.gray}>{timeFromNow}</TextComponent>
          <View
            style={{
              width: 1,
              borderRightWidth: 1,
              borderColor: appColors.gray,
              height: '90%',
            }}
          />

          <TextComponent color={appColors.gray}>
            {moment(comment.createdAt).format('hh:mm A')}
          </TextComponent>
        </View>
        {/* content */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextComponent styles={{flex: 1}}>{comment.comment}</TextComponent>
        </View>

        {/* images */}
        {imgs.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              columnGap: 10,
              rowGap: 10,
              flexWrap: 'wrap',
            }}>
            {imgs.map(f => (
              <View key={f}>
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

        {/* files */}
        {files.length > 0 && (
          <View>
            {files.map(f => (
              <View key={f} style={{flexDirection: 'row'}}>
                <FileCard source={f} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Comment;
