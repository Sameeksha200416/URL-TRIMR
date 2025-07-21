import { Link, useNavigate } from "react-router-dom";
import { LinkIcon, LogOut } from "lucide-react";

import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UrlGlobalState } from "@/context/context";
import { logoutUserSupabase } from "@/supabase_apis/apiAuth";
import useFetch from "@/hooks_for_api_calls/use-fetch";
import BarLoader from "react-spinners/BarLoader";
import { debugProfilePicture } from "@/utils/debugProfilePic";
import { useEffect } from "react";
  

const Header = () => {

  const navigate = useNavigate();

  const { loggedInUser, fetchCurrentLoggedInUserFromSupabase } = UrlGlobalState();

  const { loading, executeCallbackFunction: logoutUserFromApplication } = useFetch(logoutUserSupabase);

  // Debug profile picture when user changes
  useEffect(() => {
    if (loggedInUser) {
      debugProfilePicture(loggedInUser);
    }
  }, [loggedInUser]);


  const logoutUser = async () => {

    try {

        await logoutUserFromApplication();

        fetchCurrentLoggedInUserFromSupabase();
        
        navigate('/');
        

    } catch (error) {
        
        console.log(error);
        
    }
    
  }


  return (
    <>
        <nav className="py-4 flex justify-between items-center">

            <Link to='/'>

                <img src="/logo.png" className="h-16" alt="trimrr logo" />

            </Link>

            <div>

                {!loggedInUser ? <Button onClick={() => navigate('/auth')}>LogIn</Button> : <>
                <DropdownMenu>

                    <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>

                        <Avatar>
                            <AvatarImage 
                            src={loggedInUser?.user_metadata?.profile_pic_path_of_supabase || loggedInUser?.profile_pic_path_of_supabase} 
                            className='object-cover'
                            alt="Profile Picture"
                            onError={(e) => {
                                console.log("Image failed to load:", e.target.src);
                                e.target.style.display = 'none';
                            }}
                            />
                            <AvatarFallback>{loggedInUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <DropdownMenuLabel>{loggedInUser?.user_metadata?.name}</DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <Link to='/dashboard' className='flex items-center gap-1'>
                                <LinkIcon size={20} />
                                <span>My Links</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                        className='text-red-500 flex items-center gap-1' 
                        onClick={logoutUser}
                        >
                            <LogOut size={20} />
                            <span>logout</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>

                </>}
                
            </div>


        </nav>
        
        { loading && <BarLoader className="mb-4" width={'100%'} color="#36d7b7" /> }
    
    </>
  )
}

export default Header;