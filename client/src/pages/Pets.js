import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const query = gql`
  query GetPets {
    pets {
      id
      name
      type
    }
  }
`

const mutation = gql`
  mutation AddPet($input: NewPetInput!) {
    addPet(input: $input) {
      id
      name
      type
    }
  }
`


export default function Pets () {
  const [modal, setModal] = useState(false)
  const { data, loading, error } = useQuery(query)
  const [addPet, { mutationLoading, mutationError }] = useMutation(mutation)

  const onSubmit = input => {
    console.log(`input`, input)
    addPet({ variables: { input }})
    setModal(false)
  }
  
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
        {/* <PetsList /> */}
      </section>
    </div>
  )
}
