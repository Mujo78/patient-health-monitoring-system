import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { deleteMedicineById, getMedicine, medicine } from '../../features/medicine/medicineSlice'
import { useAppDispatch } from '../../app/hooks'
import { Button, Card, Modal, Select, Spinner, TextInput } from 'flowbite-react'
import CustomMedicineImg from '../../components/CustomMedicineImg'
import Pagination from '../../components/Pagination'
import ErrorMessage from '../../components/ErrorMessage'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import CustomButton from '../../components/CustomButton'
import Footer from '../../components/Footer'
import { HiXCircle } from 'react-icons/hi2'


function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const MedicineOverview: React.FC = () => {

  const navigate = useNavigate()
  const {medicine: med, status, message} = useSelector(medicine)
  const query= useQuery()
  const page = Number(query.get('page')) || 1;
  const searchQ = query.get('searchQuery') || '';
  const categoryQ = query.get('category') || '';
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [id, setId] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [cat, setCat] = useState<string>(categoryQ || "")
  const {id: medicineId} = useParams()
  const dispatch =useAppDispatch()

  useEffect(() => {
      const fetchData =async () => {
        try {
          if(searchQ){
            const searchQuery = searchQ
            if(categoryQ !== ''){
              const category = categoryQ
              dispatch(getMedicine({page, searchQuery, category}))
              navigate(`/medicine?searchQuery=${searchQuery}&page=${page}&category=${category}`)
            }else{
              dispatch(getMedicine({page, searchQuery}))
              navigate(`/medicine?searchQuery=${searchQuery}&page=${page}`)
            }
          }else{
            dispatch(getMedicine({page}))
          }
        } catch (error) {
          console.log(error)
        }  
      }
    fetchData();
  }, [page, dispatch,navigate, categoryQ, searchQ])

  const handleNavigate = (page: number) => {
    if(searchQ !== ''){
      const searchQuery = searchQ
      if(categoryQ !== '' || cat){
        const category = categoryQ === '' ? cat : categoryQ 
        dispatch(getMedicine({page, searchQuery, category}))
        navigate(`/medicine?searchQuery=${searchQuery}&page=${page}&category=${category}`)
      }else{
        dispatch(getMedicine({page, searchQuery}))
        navigate(`/medicine?searchQuery=${searchQuery}&page=${page}`)
      }
    }else{
      dispatch(getMedicine({page}))
      navigate(`/medicine?page=${page}`)
    }
  }

  const handleShow = (id: string) => {
    navigate(id)
  }

  const handleClickSearch = () => {
    if(search !== ''){
      if(search !== searchQ){
        const searchQuery = search;
        dispatch(getMedicine({page, searchQuery}))
        navigate(`/medicine?searchQuery=${searchQuery}&page=${page} ${categoryQ ? `&category=${categoryQ}` : ""}`)
      }
    }
  }

  const handleChangeCategory = (e:  React.ChangeEvent<HTMLSelectElement>) => {
    setCat(e.target.value)
      const searchQuery = searchQ;
      const category= e.target.value
      dispatch(getMedicine({page, searchQuery, category}))
      navigate(`/medicine?searchQuery=${searchQuery}&page=${page}&category=${category}`)
  }

  const clearSearch = () => {
    navigate('/medicine?page=1')
  }

  const deleteMedicine = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    setShowDeleteModal(true)
    setId(id)
  }

  const handleDelete = () =>{
    if(id !== ''){
      dispatch(deleteMedicineById(id)).then((action) => {
        if(typeof action.payload === 'object' && medicineId ){
          navigate(".", {replace: true})
        }
        
        setShowDeleteModal(false)
      })
    }
  }

  return (
    <>
      {
      <div className='h-full transition-all font-Poppins duration-300 divide-x flex justify-between w-full'>
        {!med || status === 'loading' ? 
        <div className='mx-auto my-auto'>
          <Spinner size="xl" />  
        </div>
        :
        <div className='w-full mr-3'>
          <div className='flex-grow w-full flex flex-col h-full justify-between'>
            <div className='flex justify-center my-4 items-center'>
              <TextInput 
                className='w-3/4'
                placeholder='Amoxicilline'
                name='search'
                onChange={(e) => setSearch(e.target.value)}
                value={search} />
              <CustomButton onClick={handleClickSearch} disabled={search === ''} size='md'>
                Search
              </CustomButton>
            </div>
            {searchQ !== '' && 
              <div className='flex items-center justify-between'>
                <Select sizing="sm" value={cat} name='category' onChange={(e) => handleChangeCategory(e)}>
                  <option value="">Category</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Antipyretics">Antipyretics</option>
                  <option value="Antacids">Antacids</option>
                  <option value="Antihistamines">Antihistamines</option>
                  <option value="Antidepressants">Antidepressants</option>
                  <option value="Anticoagulants">Anticoagulants</option>
                  <option value="Antidiabetics">Antidiabetics</option>
                  <option value="Antipsychotics">Antipsychotics</option>
                  <option value="Vaccines">Vaccines</option>
                  <option value="Other">Other</option>
                </Select>
                <span onClick={clearSearch} className='text-sm cursor-pointer text-red-500 hover:underline'>
                  Clear
                </span>
              </div>
            }
          {med?.data && status !== 'failed' ?
          <>
            <div className='w-full h-full flex-wrap items-start flex'>
              {med?.data?.map((m) => (
                <Card className={`h-fit w-1/5 relative cursor-pointer hover:bg-gray-50 w-md m-3 ${medicineId === m._id ? '!bg-green-50': ''} `} key={m._id} onClick={() => handleShow(m._id)}>
                  <HiXCircle onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => deleteMedicine(e, m._id)} className='absolute top-3 right-3 hover:w-[27px] hover:h-[27px] transition-all duration-300 text-red-600 w-[25px] h-[25px]' />
                  <div className='flex flex-col gap-2 w-full justify-around'>
                      <CustomMedicineImg url={m.photo.startsWith(m.name) ? `http://localhost:3001/uploads/${m.photo}` : m.photo} className='mx-auto w-[100px] h-[100px] rounded-xl' />
                        <p className='text-xl font-semibold'>{m.name}</p>
                        <p className='text-xs'>{m.category}</p>
                        <p className='text-md font-bold mt-auto ml-auto'>{m.available ? <span className='text-green-500'> {m.price} BAM</span> : <span className='text-red-600'>Not available</span>}</p>
                   </div>
                </Card>
              ))}
            </div>
            <Pagination page={Number(med?.currentPage)} totalPages={Number(med?.numOfPages)} handleNavigate={handleNavigate} />
          </>
          :
          <div className='h-full w-full flex-col flex justify-center items-center'>
             <ErrorMessage text={message} size='md' className='my-auto mt-20' />
             {searchQ && <Footer variant={1}>
                <Button onClick={clearSearch} color='failure' className='m-3 text-white font-bold hover:underline cursor-pointer'>
                  Clear
                </Button>
             </Footer>}
          </div>
          }
          </div>
        </div>}
        <div className='w-1/3 h-full'>
          {!medicineId ? 
          <div className='flex h-full justify-center items-center text-center'>
            <ErrorMessage text="You haven't selected any medicine to review" size='md' />
          </div> : 
          <div>
            <Outlet />
          </div>
          }
        </div>
       <Modal show={showDeleteModal} position="top-center" onClose={() => setShowDeleteModal(false)}>
          <Modal.Header>Delete medicine</Modal.Header>
          <Modal.Body>
            <p className='font-bold'>Are you sure, you want to delete medicine from your Pharmacy store?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleDelete} color="failure">I accept</Button>
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </div>}
    </>
  )
}

export default MedicineOverview

