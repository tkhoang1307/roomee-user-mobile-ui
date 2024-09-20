import {AccomRoomModel} from '@models/accommodation';

interface UseRoomNameProps {
  rooms: AccomRoomModel[];
}

const useRoomName = ({rooms}: UseRoomNameProps) => {
  const getRoomIdFromRoomname = (name: string) => {
    const filteredRooms = rooms.filter(
      r => r.name.toLowerCase() === name.toLowerCase(),
    );
    if (filteredRooms.length > 0) return filteredRooms[0].id;
    return '';
  };

  const getRoomNameFromId = (id: string) => {
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    return rooms[index].name;
  };

  return {
    getRoomIdFromRoomname,
    getRoomNameFromId,
  };
};

export default useRoomName;
