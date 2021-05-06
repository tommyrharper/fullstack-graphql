import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      type
      img
    }
  }
`

const ADD_PET = gql`
  mutation AddPet($input: NewPetInput!) {
    addPet(input: $input) {
      id
      name
      type
      img
    }
  }
`


export default function Pets () {
  const [modal, setModal] = useState(false)
  const { data, loading, error } = useQuery(GET_PETS)
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
    addPet({ variables: { input }})
    setModal(false)
  }

  if (loading || newPet.loading) return <Loader />

  if (error || newPet.error) return <span>Error</span>
  
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
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
