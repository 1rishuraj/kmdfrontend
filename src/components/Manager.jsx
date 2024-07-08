import React from 'react'
import { useRef, useState, useEffect } from 'react';
// to install toastify : $ npm install --save react-toastify
// importing toastify library by below 2 lines
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// npm install uuid
// below imported to generate a unique id everytime uuidv4() is called
import { v4 as uuidv4 } from 'uuid';
const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" }) // initially all will be empty
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        // async-await fxn fetching from db
        let req = await fetch("https://kmd-rho.vercel.app/", {
            method: 'GET',
            credentials: 'include' // Include credentials in the request if needed
        });
        // converting the table "passwords" array to json
        let passwords = await req.json()
        //  due to this our passwords persists on the site once saved as they are present in our mongo database
        setPasswordArray(passwords)
    }

    // acts on 1st load only
    useEffect(() => {
        getPasswords()
    }, [])


    const copyText = (text) => {
        // to show the pop up whenever copytext lordicon clicked 
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
        // navigator.clipboard.writeText(text) is a JavaScript function that allows you to copy text to the user's clipboard. This function is part of the Clipboard API
    }



    const showPassword = () => {
        // passwordRef.current.type = "text"
        console.log(ref.current.src)
        // toggles b/w closed eye and open eye on click
        // when crossed eye is clicked , eye opens and password invisible
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password" //invisible
        }
        // else when open eye is clicked , eye closes and password visible
        else {
            passwordRef.current.type = "text" //visible
            ref.current.src = "icons/eyecross.png"
        }

    }

    const savePassword = async () => {
        if(form.site.length >3 && form.username.length >3 &&form.password.length >3){

            //if the form has id assigned means, i did editing before so delete it from db to add it as a new edited password form
            if (form.id!==undefined) {
                await fetch("https://kmd-rho.vercel.app", { 
                    method: "DELETE", 
                    headers: { "Content-Type": "application/json" }, 
                     credentials: 'include',
                    body: JSON.stringify({ id:form.id }) 
                });
            }
            //  the form object is added to the passwordArray using the spread operator, creating a new array that contains all the elements from passwordArray plus the latest form object made.
            // before putting latest form it is spreaded to add uuidv4() unique id to it 
            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])

            // The form document is then saved via Post request to mongodb as a single JSON string with id by uuid
            await fetch("https://kmd-rho.vercel.app", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: 'include', body: JSON.stringify({ ...form, id: uuidv4() }) })
             
            

            setform({ site: "", username: "", password: "" }) //does clear the form once the data is saved.
            toast('Password saved!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
    else{
        toast('Error: Password not saved!');
        // password save if all 3 inputs have their length>3
    }

    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if(c){
            setPasswordArray(passwordArray.filter(item=>item.id!==id))
            // filter() method create a new array that excludes the element with the id that matches the id passed as a parameter.
            
            // same syntax delete request where we are deleting via id
            await fetch("https://kmd-rho.vercel.app", { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: 'include', body: JSON.stringify({ id }) })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
            
    }
    const editPassword = (id) => {
         
        console.log("Editing password with id ", id)
        // passwordArray.filter(i=>i.id===id) creates a new array that contains only the elements from passwordArray where the id property matches the id passed as a parameter.
        //  as it returns array of 1 element, we can consider only the first element & update the form so that it gets them as it is & we spred it to add the same id to be edited to form so that it can get deleted in save password
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })

        // adds our edited form elements with new id to passwrdArray
        //  but we dont alter our local storage until save buuton clicked as what if user just clicked for edit but didnt want to save
        setPasswordArray(passwordArray.filter(item=>item.id!==id)) 

    }



    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
        // spread operator ...form create a new object that includes all the existing properties of the form object.
        // gives each name(which must have keyname {refer name attributes})-> the entered value 
    }



    return (
        <>
        {/* cumpulsory syntax for toastify  */}
        {/* now for using toast we use this wherever needed:
        toast('Show Whatever Text Here!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            }); */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />
                     

            {/* using mycontainer class to keep things at centre in laptop */}
            {/* here min-h-[85.01vh] to keep footer at bottom */}
            <div className=" p-3 md:mycontainer min-h-[85.01vh] ">
                {/* giving a heading & keeping at centre */}
                <h1 className='text-4xl text font-bold text-center'>
                    <span className='text-yellow-400'> &lt;</span>

                    <span>Key</span><span className='text-yellow-400'>Master🗝&gt;</span>

                </h1>
                <p className='text-slate-900 text-lg text-center'>"Master Your Keys, Secure Your World"</p>

                {/* here flexcol keep (user & pass) below  site url, gap 8 in between*/}
                {/* here alignitems center works brings item at centre of x-axis (as flex column is opposite of flex row) */}
                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    {/* form is a useState whose url is provided by form.site */}
                    {/* on changing the values ie. when user enters data handleChange fxn runs*/}
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' 
                    // w-full is width full for url
                    // name attribute has the form useState key name for site
                    className='rounded-full border border-yellow-500 w-full p-4 py-1' type="text" name="site" id="site" />
                    {/* here flex col keep password below username  in mobile while laptop has flexrow */}
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-yellow-500 w-full p-4 py-1' type="text" name="username" id="username" />
                        
                        <div className="relative">
                            {/* making this class relative so the 'eye' icon comes in absolute */}
                            {/* when password type: password its not visible by default */}
                            {/* we refer it via useRef: passwordRef & see showPassword fxn */}
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-yellow-500 w-full p-4 py-1' type="password" name="password" id="password" />
                            {/* right-[3px] space from right */}
                            {/* on clicking a fxn showPassword runs */}
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                {/* useRef hook to refer this image tag in showPassword fxn */}
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>

                    </div>
                    {/* w-fit gives width as per text of button */}
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-yellow-300 hover:bg-yellow-200 rounded-full px-8 py-2 w-fit border border-slate-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" >
                        </lord-icon>
                        Save</button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No passwords to show</div>}
                    {/* for table to have border radius we need to give overflow hidden */}
                    {/* Showing Table only when LocalStorage has something in password Array */}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className='bg-slate-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-yellow-300'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}> {/* key index is passed for each row key*/}
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            {/* below line opens site saved in new tab on click */}
                                            <a href={item.site} target='_blank'>{item.site}</a>
                                            {/* lordiconcopy class for identification */}
                                            <div className='lordiconcopy size-7 cursor-pointer' 
                                            onClick={() => { copyText(item.site) }}>
                                            {/* // we gave ()=> fxn here to avoid automatic execution of getting copied, Note: this happens when fxn needs an argument */}
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{item.username}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            {/* hiding password by asterick */}
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='justify-center py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={()=>{editPassword(item.id)}}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer mx-1'onClick={()=>{deletePassword(item.id)}}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{"width":"25px", "height":"25px"}}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>

                            })}
                        </tbody>
                    </table>}
                </div>
            </div>

        </>
    )
}

export default Manager
