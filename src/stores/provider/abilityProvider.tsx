import {AbilityTuple, MongoAbility, MongoQuery} from '@casl/ability';
import {createContext, useContext, useEffect, useState} from 'react';

import defineAbility, {updateAbility} from '../../defineAbility';
import {createContextualCan} from '@casl/react';
import {UserContext} from './userProvider';

const initialAbility = defineAbility();

const AbilityContext =
  createContext<MongoAbility<AbilityTuple, MongoQuery>>(initialAbility);

const Can = createContextualCan(AbilityContext.Consumer);

function AbilityProvider({children}: {children?: React.ReactNode}) {
  const [ability, setAbility] =
    useState<MongoAbility<AbilityTuple, MongoQuery>>(initialAbility);
  const {userState} = useContext(UserContext);

  useEffect(() => {
    updateAbility(ability, userState);
    setAbility(ability);
  }, [userState]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export {Can, AbilityProvider, AbilityContext};
