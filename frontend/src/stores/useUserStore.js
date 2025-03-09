import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast';

export const useUserStore = create((set,get) => ({
        user : null,
        loading : false,
        checkingAuth : true,

        signup : async({name,email,password,confirmPassword}) =>{
            set({loading : true});
            if(password !== confirmPassword){
                return toast.error("Passwords do not match");
            }
            try {
                const res = await axios.post('/auth/signup',{name,email,password});
                set({user : res.data});
                toast.success("Signup successful");
            } catch (error) {
                toast.error(error.response.data.message);
            }finally{
                set({loading : false});
            }

        },
        login : async({email,password}) => {
            set({loading : true});
            try {
                const res = await axios.post('/auth/login',{email,password});
                set({user : res.data});
                toast.success("login successful");
            } catch (error) {
                toast.error(error.response.data.message);
            }finally{
                set({loading : false});
            }
        },
        checkAuth : async () => {
            set({checkingAuth : true});
            try {
                const res = await axios.get('/auth/profile');
                set({user : res.data});
            } catch (error) {
                toast.error(error.response.data.message);
            }finally{
                set({checkingAuth : false});
            }
        },
        logout : async () =>{
            try {
                await axios.post('/auth/logout');
                set({user : null});
                toast.success("Logout successful");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
}));
