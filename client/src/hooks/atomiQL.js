import React, { useEffect, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { petsAtom } from '../components/App';
import { useAtom } from "jotai";

export default function atomiQL(query) {
  const { data, loading, error } = useQuery(query);
  const [pets, setPets] = useAtom(petsAtom)
  const atomUpdated = useRef(false)
  const prevLoading = useRef(loading)

  useEffect(() => {
    if (!loading && data && !atomUpdated.current) {
      atomUpdated.current = true;
      setPets(data);
    }
  }, [data]);

  useEffect(() => {
    prevLoading.current = loading;
    // console.log('-------- inside loading useEffect--------')
    // console.log(`loading`, loading)
    // console.log(`prevLoading`, prevLoading)
    // console.log('-------- finished loading useEffect--------')
  }, [loading])

  //   console.log('-------- inside hook --------')
  // console.log(`loading`, loading);
  // console.log(`prevLoading`, prevLoading);
  // console.log('-------- finished hook --------')


  return { data: pets, loading: prevLoading.current, error }
}
