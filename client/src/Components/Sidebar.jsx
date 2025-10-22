import { useState } from "react"
import {BsPersonFillAdd} from 'react-icons/bs'
import {ImEnter, ImHome} from 'react-icons/im'
import {GiHomeGarage} from 'react-icons/gi'
import {MdEmojiEvents,MdOutlineEmojiEvents,MdEvent} from 'react-icons/md'
import {VscThreeBars} from 'react-icons/vsc';
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Drawer,
} from "@material-tailwind/react";
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
function Sidebar() {   
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const userInfo =useSelector((state)=>state.auth.userInfo);
  return (
      <div className='mt-24 '>
         <div className="hidden lg:block">
         <Card className="fixed top-4 w-fit h-full  max-w-[20rem] p-4 shadow-2xl shadow-deep-orange-200 mt-12 bg-[#bce9cb]">
              <List className="font-bold text-black pt-10 ">
              
                {/* <Link to={`/admin/${userInfo?.user_id}/products`}>
                  <ListItem>
                    <ListItemPrefix>
                        <MdEmojiEvents className="h-5 w-5" />
                    </ListItemPrefix>
                    Products
                  </ListItem>
                </Link> */}
               
               
                <Link to={`/admin/${userInfo?._id}/addAdmin`}>
                  <ListItem>
                    <ListItemPrefix>
                      <BsPersonFillAdd className="h-5 w-5" />
                    </ListItemPrefix> 
                    Add Admin
                  </ListItem>
                </Link>
                <Link to={`/admin/${userInfo?._id}/allProducts`}>
                  <ListItem>
                  <ListItemPrefix>
                      <GiHomeGarage className="h-5 w-5" />
                  </ListItemPrefix>
                  All Products
                </ListItem>
                </Link>
                <Link to={`/admin/${userInfo?._id}/addProduct`}>
                  <ListItem>
                  <ListItemPrefix>
                      <GiHomeGarage className="h-5 w-5" />
                  </ListItemPrefix>
                  Add Product
                </ListItem>
                </Link>
                
              
                
              </List>
              </Card>
         </div>
          <div className="lg:hidden block ">
            <div className="flex gap-3 items-center text-brown-900">
              <VscThreeBars onClick={openDrawer} className="ml-5"/>
              <h1 className="font-bold text-2xl ">Demo Board</h1>
            </div>
            <Drawer open={open} onClose={closeDrawer}>
              <Card>
              <List className="font-bold text-black flex flex-col gap-5 ">
                
                {/* <Link to={`/admin/${userInfo?.user_id}/products`}>
                  <ListItem>
                    <ListItemPrefix>
                        <MdEmojiEvents className="h-5 w-5" />
                    </ListItemPrefix>
                    Products
                  </ListItem>
                </Link> */}
               
                
                <Link to={`/admin/${userInfo?._id}/addAdmin`}>
                  <ListItem>
                    <ListItemPrefix>
                      <BsPersonFillAdd className="h-5 w-5" />
                    </ListItemPrefix> 
                    Add Admin
                  </ListItem>
                </Link>
                
                <Link to={`/admin/${userInfo?._id}/addProduct`}>
                  <ListItem>
                  <ListItemPrefix>
                      <GiHomeGarage className="h-5 w-5" />
                  </ListItemPrefix>
                  Add Product
                </ListItem>
                </Link>
               

              </List>
              </Card>
            </Drawer>
          </div>
      </div>
  )
}

export default Sidebar;