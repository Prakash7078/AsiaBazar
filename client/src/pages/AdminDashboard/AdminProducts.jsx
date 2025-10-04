import { BiSolidAddToQueue, BiSolidEditAlt } from "react-icons/bi";
import Sidebar from "../../Components/Sidebar"
import { Avatar, Button, Card, CardHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {  deleteProduct, getProducts } from "../../redux/productSlice";
import { Link } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
function AdminProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5; // Number of products per page
  const dispatch=useDispatch();
  const userInfo =useSelector((state)=>state.auth.userInfo);
  const { products, loading } = useSelector((state) => state.product);
  const [filters, setFilters] = useState({
    name: '',
    price: '',
    quantity: '',
    total: '',
    category: '',
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
    
  useEffect(()=>{
    const fetchProducts=async()=>{
      await dispatch(getProducts());
    };
    fetchProducts();
  },[dispatch])
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Rings
          height="80"
          width="80"
          color="#21BF73"
          radius="6"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="rings-loading"
        />
      </div>
    );
 }
  const handleDelete=async(id)=>{
    console.log("id",id);
    await dispatch(deleteProduct(id));
    // await dispatch(getClubs());
  }
        // Function to handle page change
  const handlePageChange = (selectedPage) => {
      setCurrentPage(selectedPage.selected + 1);
  };
  const TABLE_HEAD = ["Product_Image","Product_Name", "Product_Price", "Product_Quantity","Total_Quantity", "Product_Category", "Edit","Delete"];
  
  const filteredProducts = products?.filter((item) => {
    return (
      item.product_name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.product_price.toString().includes(filters.price) &&
      `${item.product_quantity}${item.quantity_measure}`.toLowerCase().includes(filters.quantity.toLowerCase()) &&
      item.total_quantity.toString().includes(filters.total) &&
      item.product_category.toLowerCase().includes(filters.category.toLowerCase())
    );
  });
  
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  
  return (
    <div>
      <div className="pt-5 w-fit">
        <Card className="h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8 flex-col sm:flex-row">
              <div >
                <Typography variant="h5" color="brown-gray">
                  Products List
                </Typography>
                <Typography color="gray" className="mt-1 font-normal" >
                  See Information about all products.
                </Typography>
              </div>
              <div className="flex flex-row gap-2 shrink-0">
                <Button variant="outlined" color="brown" size="sm" >
                  view all
                </Button>
                <Button color="brown" size="sm" >
                  <Link to={`/admin/addProduct`}>
                    <div  className="flex gap-2">
                      <BiSolidAddToQueue/>
                      Add Product
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="overflow-x-auto mx-2 sm:mx-0">
            <table className="w-full table-auto text-left ">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
                <tr>
                  <td className="p-2" />
                  <td className="p-2">
                    <input
                      name="name"
                      value={filters.name}
                      onChange={handleFilterChange}
                      placeholder="Search Name"
                      className="text-sm border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="price"
                      value={filters.price}
                      onChange={handleFilterChange}
                      placeholder="Search Price"
                      className="text-sm border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="quantity"
                      value={filters.quantity}
                      onChange={handleFilterChange}
                      placeholder="Search Quantity"
                      className="text-sm border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="total"
                      value={filters.total}
                      onChange={handleFilterChange}
                      placeholder="Search Total"
                      className="text-sm border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      placeholder="Search Category"
                      className="text-sm border px-2 py-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2" />
                  <td className="p-2" />
                </tr>

              </thead>
              <tbody>
                {currentProducts?.map((item, index) => {
                  const isLast = index === products.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
      
                  return (
                    
                    <tr key={item?._id}>
                      <td className={classes}>
                        <Link to={`/${item.name}`}><Avatar src={
                            (() => {
                              try {
                                const images = JSON.parse(item?.product_image);
                                console.log('images',images[0])
                                return images[0]; // get first image
                              } catch (err) {
                                return err; // fallback if parsing fails
                              }
                            })()
                          }
                          alt={item?._id} size="sm" />
                        </Link>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.product_name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          ${item.product_price}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item?.product_quantity}{item?.quantity_measure}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.total_quantity}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {item.product_category}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Link to={`/admin/${userInfo?._id}/updateProduct/${item._id}`}>
                          <BiSolidEditAlt size={22}/>
                        </Link>
                      </td>
                      <td className={classes}>
                        <Link to={`/admin/${userInfo?._id}/deleteProduct/${item._id}`}>
                          <MdDelete size={20} color="red" className="cursor-pointer" onClick={()=>handleDelete(item._id)}/>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName="flex mt-4 justify-center"
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            activeClassName="text-primary"
            disabledClassName="text-gray-500 cursor-not-allowed"
            pageClassName="px-2 cursor-pointer"
            previousClassName="px-2 cursor-pointer"
            nextClassName="px-2 cursor-pointer"
            breakClassName="px-2"
        />    
      </div>
  )
}

export default AdminProducts