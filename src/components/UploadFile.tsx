import {TouchableOpacity} from 'react-native';
import {DocumentPickerResponse, pick} from 'react-native-document-picker';

interface UploadFileProps {
  children: React.ReactNode;
  setSelectedFiles: React.Dispatch<
    React.SetStateAction<DocumentPickerResponse[]>
  >;
}

const UploadFile: React.FC<UploadFileProps> = ({
  children,
  setSelectedFiles,
}) => {
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          const rs = await pick();
          setSelectedFiles(prev => [...prev, ...rs]);
          // do something with the uri
        } catch (err) {
          // see error handling section
          console.error(err);
        }
      }}>
      {children}
    </TouchableOpacity>
  );
};

export default UploadFile;
