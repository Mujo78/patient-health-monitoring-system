import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getPatientsForDoctor, searchForPatient } from '../../service/patientSideFunctions'
import PatientCard from '../../components/PatientCard'
import { Patient } from '../../features/medicine/medicineSlice'
import { Spinner, TextInput } from 'flowbite-react'
import ErrorMessage from '../../components/ErrorMessage'
import CustomButton from '../../components/CustomButton'
import Pagination from './Pagination'

type patients = {
  currentPage: number | null,
  data: Patient[],
  numOfPages: number
}

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const MyPatients: React.FC = () => {

  const navigate = useNavigate()
  const {id} = useParams()
  const query = useQuery()
  const [loading, setLoading] = useState<boolean>(false)
  const page = query.get('page') || 1
  const searchQuery = query.get('searchQuery');

  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState<patients | undefined>()
  const [message, setMessage] = useState<string>("") 

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        try {
          setLoading(true);
          if (searchQuery) {
            const response = await searchForPatient(searchQuery, Number(page));
            setPatients(response);
          } else {
            const response = await getPatientsForDoctor(Number(page));
            setPatients(response);
          }
        } catch (err: any) {
          setMessage(err.response?.data || 'An error occurred');
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchData();
  }, [page, searchQuery, id]);

  const handleNavigatePage = async (newPage: number) => {
    try {
      setLoading(true);
      if (searchQuery !== null) {
        const response = await searchForPatient(searchQuery, newPage);
        setPatients(response);
        navigate(`/my-patients/search?searchQuery=${searchQuery}&page=${newPage}`);
      } else {
        const response = await getPatientsForDoctor(newPage);
        setPatients(response);
        navigate(`/my-patients?page=${newPage}`);
      }
    } catch (err: any) {
      setMessage(err.response?.data || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = async () => {
      setPatients(undefined);
  
      try {
        setLoading(true);
        navigate(`/my-patients/search?searchQuery=${search}&page=1`);
        const response = await searchForPatient(search, 1);
        setPatients(response);
      } catch (err:any) {
        setMessage(err.response?.data || 'An error occurred');
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className='h-fit mr-3 font-Poppins'>
    {id ? <Outlet /> : 
    <div className='h-[90vh]'>
      <>
        <div className='w-full flex flex-col min-h-full'>
          <div className='flex h-2/6 p-2 w-3/4 mx-auto items-center'>
            <TextInput
              sizing="sm"
              className='w-full mr-3'
              name='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by name'
              />
            <CustomButton onClick={handleSearch} disabled={search === ''} size='sm'>Search</CustomButton>
          </div>
          {loading ? <div className='flex justify-center mt-24'> <Spinner size="lg" /> </div> : 
            patients && patients.data?.length > 0 ?
            <>
              <div className='w-full h-5/6'>
                {loading ?
                <div className='flex justify-center mt-24'>
                  <Spinner size="lg" />   
                  </div> : 
                  <div className='flex w-full flex-center flex-wrap'>
                    {patients?.data.map((n) => (
                      <PatientCard key={n._id} className='m-1' data={n} variant={2} />
                  ))}
                    </div>
                }
              </div>
              <div className='w-full h-2/6 flex mt-auto'>
                  <Pagination page={Number(page)} totalPages={patients.numOfPages} handleNavigate={handleNavigatePage}   />
              </div>
            </>
          :
          <div className='flex justify-center h-[70vh] items-center'>
            < ErrorMessage text={message} size='md' />
          </div>}
        </div>
      </>
    </div>}
    </div>
  )
}

export default MyPatients