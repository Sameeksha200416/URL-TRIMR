import supabase, { supabaseUrl } from "@/db/supabase";
import { toast } from "sonner"
import { uploadProfilePicture } from "@/utils/profilePictureManager";


export const loginUserInSupabase = async ({email, password}) => {

    try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {

            throw new Error(error?.message);

        }

        toast("you have logged in successfully", {
            position: 'top-right'
        });

        return data;
               
    } catch (error) {
        
        console.log(error);

        toast("Invalid Authentication or Something went Wrong.", {
            position: 'top-right'
        });

        return error;
        
    }

}


export const signUpUserInSupabase = async ({ name, email, password, profile_pic }) => {

    try {

        // Upload profile picture using the new utility
        const uploadResult = await uploadProfilePicture(profile_pic, name);

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name,
                    profile_pic_path_of_supabase: uploadResult.publicUrl,
                    profile_pic_filename: uploadResult.fileName
                }
            }
        });

        if (signUpError) {

            throw new Error(signUpError?.message);

        }

        toast("you have signed up successfully", {
            position: 'top-right'
        });

        return data;
        
    } catch (error) {
        
        console.log(error);

        toast("Invalid Authentication or User already exists.", {
            position: 'top-right'
        });

        return error;

    }

}


export const getCurrentAuthenticatedUser = async () => {

    try {

        const { data, error } = await supabase.auth.getUser();

        if (!data?.user) {

            return null;

        }

        if (error) {

            throw new Error(error?.message);

        }

        return data?.user;
        
    } catch (error) {
        
        console.log(error);

        return error;
        
    }

}


export const logoutUserSupabase = async () => {

    try {

        toast("you have been logged out successfully", {
            position: 'top-right'
        });

        const { error } = await supabase.auth.signOut();

        if (error) {

            throw new Error(error?.message);

        }
        
    } catch (error) {
        
        console.log(error);

        toast("Something went Wrong.", {
            position: 'top-right'
        });

        return error;
        
    }

}