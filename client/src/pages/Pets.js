import React, {useState, useEffect} from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'
import atomiQL from '../hooks/atomiQL';


const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    name
    type
    img
    vaccinated @client
    owner {
      id
      age @client
    }
  }
`

const GET_PETS = gql`
  query GetPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`

const ADD_PET = gql`
  mutation AddPet($input: NewPetInput!) {
    addPet(input: $input) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`


export default function Pets () {
  const [modal, setModal] = useState(false)
  const renderCount = React.useRef(0);
  const { data, loading, error } = atomiQL(GET_PETS);
  // const { data, loading, error } = useQuery(GET_PETS);


  useEffect(() => {
    // console.log('------------ inside useEffect -----------')
    // console.log(`data`, data)
    // console.log(`loading`, loading)
    // console.log(`error`, error)
    renderCount.current = renderCount.current + 1;
  });

  const [addPet, newPet] = useMutation(
    ADD_PET,
    {
      update(cache, { data: { addPet } }) {
        const { pets } = cache.readQuery({ query: GET_PETS })
        cache.writeQuery({
          query: GET_PETS,
          data: { pets: [addPet, ...pets] }
        })
      }
    }
  )


  const onSubmit = input => {
    console.log(`input`, input)
    addPet({
      variables: { input },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: Math.floor(Math.random() * 1000) + '',
          name: input.name,
          type: input.type,
          img: 'https://via.placeholder.com/300',
          vaccinated: true,
          owner: {
            id: '',
            age: 35
          }
        }
      }
    })
    setModal(false)
  }

  if (loading) return <Loader />

  if (error || newPet.error) return <span>Error</span>
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  // console.log(`data.pets`, data.pets)


  return (
    <div className="page pets-page">
      <section>
        <div className="row between-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
            {/* <span> Render Count: {renderCount.current}</span> */}
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        { !loading && !error && <PetsList pets={data.pets} /> }
      </section>
    </div>
  )
}
