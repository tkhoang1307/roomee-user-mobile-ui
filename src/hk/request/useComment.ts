import _ from 'lodash';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

import {CommentModel} from '@models/request';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {requestService} from '@services';

const {flow, partialRight: pr, keyBy, values} = _;

const lastUniqBy = (iteratee: _.ValueIteratee<CommentModel>) =>
  flow(pr(keyBy, iteratee), values);

export const useComments = ({requestId}: {requestId: string}) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    setComments([]);

    setCommentsLoading(true);
    const subscriber = firestore()
      .collection<CommentModel>('comments')
      .where('topicId', '==', requestId)
      .onSnapshot(snapshot => {
        if (snapshot) {
          const newCmts = snapshot.docChanges().map(val => val.doc.data());

          setComments(prev => {
            const newArr = [...prev, ...newCmts];

            return lastUniqBy('createdAt')(newArr).sort((a, b) =>
              a.createdAt < b.createdAt ? 1 : -1,
            );
          });
        }
        setCommentsLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [requestId]);

  return {comments, setComments, commentsLoading};
};

interface UseAddCommentProps {
  comment: Partial<CommentModel>;
  selectedImages: ImageOrVideo[];
  selectedFiles: DocumentPickerResponse[];
  setSelectedImages: React.Dispatch<React.SetStateAction<ImageOrVideo[]>>;
  setSelectedFiles: React.Dispatch<
    React.SetStateAction<DocumentPickerResponse[]>
  >;
}

export const useAddComment = () => {
  const [loading, setLoading] = useState(false);

  const addComment = async ({
    comment,
    selectedImages,
    selectedFiles,
    setSelectedFiles,
    setSelectedImages,
  }: UseAddCommentProps) => {
    if (
      comment.comment?.length === 0 &&
      selectedFiles.length === 0 &&
      selectedImages.length === 0
    )
      return;
    setLoading(true);
    try {
      const docRef = await firestore()
        .collection<Partial<CommentModel>>('comments')
        .add(comment);

      const cmt = await docRef.get();

      if (selectedImages.length > 0) {
        const bodyFormData = new FormData();

        const tokens = selectedImages[0].path.split('/') || ['dummy'];
        const fileName = tokens[tokens.length - 1] || 'dummy';

        bodyFormData.append('file', {
          uri: selectedImages[0].path,
          type: selectedImages[0].mime,
          name: fileName,
          size: selectedImages[0].size,
        });
        await requestService.createCommentAttachments({
          commentId: cmt.id,
          payload: bodyFormData,
        });

        selectedImages.shift();
      } else if (selectedFiles.length > 0) {
        const bodyFormData = new FormData();
        bodyFormData.append('file', {
          uri: selectedFiles[0].uri,
          type: selectedFiles[0].type,
          name: selectedFiles[0].name,
          size: selectedFiles[0].size,
        });
        await requestService.createCommentAttachments({
          commentId: cmt.id,
          payload: bodyFormData,
        });

        selectedFiles.shift();
      }

      const uploadImgs = selectedImages.map(async f => {
        const bodyFormData = new FormData();

        const tokens = f.path.split('/') || ['dummy'];
        const fileName = tokens[tokens.length - 1] || 'dummy';

        bodyFormData.append('file', {
          uri: f.path,
          type: f.mime,
          name: fileName,
          size: f.size,
        });

        return await requestService.createCommentAttachments({
          commentId: cmt.id,
          payload: bodyFormData,
        });
      });
      const uploadFiles = selectedFiles.map(async f => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', {
          uri: f.uri,
          type: f.type,
          name: f.name,
          size: f.size,
        });

        return await requestService.createCommentAttachments({
          commentId: cmt.id,
          payload: bodyFormData,
        });
      });

      setSelectedFiles([]);
      setSelectedImages([]);

      await Promise.all([uploadImgs, uploadFiles].flat());
    } catch (err) {
      console.log('err: ', err);
    } finally {
      setLoading(false);
    }
  };

  return {addComment, loading};
};
