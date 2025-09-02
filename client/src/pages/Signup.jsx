import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from "react-redux";
import { signupUser } from "../redux/authSlice";
import { Link } from 'react-router-dom';
import { Button, Input, Typography } from '@material-tailwind/react';
import { toast } from 'react-toastify';
function Signup() {
    const[data,setData]=useState({
        name:"",
        email:"",
        password:"",
        // image:null,
        // branch:"",
        // year:0,
        // section:"",
        mobileno:"",
        address:"",
        admin:false,
    });
    const [error, setError] = useState('');
    const dispatch = useDispatch();
	const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    
	const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError(''); // Clear any previous error when the user makes changes
    };
    // const handleFile=(e)=>{
    //     setData({...data,image:e.target.files[0]});
    // }

    // const validateRollNo = (rollno) => {
    //     const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    //     return rollno.length === 10 && alphanumericRegex.test(rollno);
    //   };
    const handleSignup=async(e)=>{
        e.preventDefault();
        if(!data.address || !data.email || !data.password || !data.mobileno || !data.address){
            toast.error("Please fill all the required details")
            return;
        }
        if(data.mobileno?.length!=10){
            toast.error("Invalid Mobile number")
            return;
        }
        // if (!validateRollNo(data.rollno)) {
        //     // Rollno doesn't meet the constraints
        //     // You can show an error message or handle it as needed
        //     setError('Invalid rollno. Please enter a 10-digit alphanumeric rollno.');
        //     return;
        //   }
          // Include image in data only if a file is selected
        

        await dispatch(signupUser(data));
	    navigate('/');
    }
    useEffect(()=>{
        if(userInfo){
            navigate("/login");
        }
    },[navigate,userInfo]);
  return (
    <div className='flex-col flex justify-center items-center h-full w-full' >
        <div className='border-2 shadow-lg flex flex-col items-center justify-center bg-white rounded-lg mt-32 pl-2 py-10'>
                <Typography variant="h4" color="blue-gray">
                    Sign Up
                </Typography>            
                <form onSubmit={handleSignup} className='flex flex-col md:py-0 my-3 gap-6 sm:px-10 sm:mx-5 mx-10 px-0'>
                    <Input size="lg" required label="Name" name="name" value={data.name}onChange={handleChange}/>
                    <Input size="lg" required label="Email" name="email" value={data.email} onChange={handleChange}/>
                    <Input type="password" required size="lg" label="Password" value={data.password} name="password" onChange={handleChange}/>
                    <textarea 
                        required
                        id="address" 
                        name="address" 
                        rows="3" 
                        value={data.address}
                        placeholder="123 Main St&#10;New York, NY 10001" 
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full resize-none">
                    </textarea>
                    {/* <Input className='outline-none'type='file'onChange={handleFile} /> */}
                    {/* <div className='flex gap-14'>
                        <Typography htmlFor="branchselect">Branch</Typography>
                        <select id="branchselect"  name="branch" onChange={handleChange} value={data.branch}className="border-2 px-5 py-1">
                            <option value="" disabled>
                            select Branch
                            </option>
                            <option value="CS">CS</option>
                            <option value="DS">DS</option>
                            <option value="MECH">MECH</option>
                            <option value="BA">Business</option>
                            <option value="AS">Aerospace</option>
                            <option value="SCM">Supply Chain</option>
                        </select>
                    </div> */}
                    {/* <div className='flex gap-14'>
                        <Typography htmlFor="yearselect">Semester</Typography>
                        <select id="yearselect"  name="year" onChange={handleChange} value={data.year}className="border-2 px-5 py-1">
                            <option value="0" disabled>
                            select Semester
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div> */}
                    {/* <div className='flex gap-14 '>
                        <Typography htmlFor="sectionselect">Category</Typography>
                        <select id="sectionselect" name="section"  onChange={handleChange} value={data.section} className="border-2 px-5 py-1">
                            <option value="" disabled>
                            select Category
                            </option>
                            <option value="M">Male</option>
                            <option value="F">Female-</option>
                            
                        </select><br/>
                    </div> */}

                    <div>
                        <Input type="text" required label="MobileNo"name="mobileno" onChange={handleChange} value={data.rollno}/>
                        {/* {error && <Typography className='text-red-500'>{error}</Typography>} */}
                    </div>
                    <Button onClick={handleSignup} color='brown'>SignUp</Button>
                    <Typography className='mb-5'>Already have an account <Link className='font-semibold ml-3' to='/login'>Login</Link></Typography>
                </form>
        </div>
    </div>
    
  )
}

export default Signup
