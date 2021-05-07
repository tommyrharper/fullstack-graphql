import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { petsAtom } from '../components/App';
import { useAtom } from "jotai";

export default function atomiQL(query) {
  const { data, loading, error } = useQuery(query);
  const [pets, setPets] = useAtom(petsAtom)
  const atomUpdated = React.useRef(false)

  React.useEffect(() => {
    if (!loading && data && !atomUpdated.current) {
      atomUpdated.current = true;
      setPets(data);
    }
  }, [data]);


  return { data: pets, loading, error }
}
