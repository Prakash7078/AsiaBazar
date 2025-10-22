import { BiSolidAddToQueue, BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Avatar, Button, Card, CardHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProducts } from "../../redux/productSlice";
import { Link } from "react-router-dom";
import { Rings } from "react-loader-spinner";

function AdminProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { products, loading } = useSelector((state) => state.product);
  const [filters, setFilters] = useState({
    name: "",
    price: "",
    quantity: "",
    total: "",
    category: "",
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Rings height="80" width="80" color="#21BF73" visible={true} />
      </div>
    );
  }

  const TABLE_HEAD = [
    "Image",
    "Name",
    "Price",
    "Size",
    "Stock",
    "Category",
    "Edit",
    "Delete",
  ];

  const filteredProducts = products?.filter((item) => {
    return (
      item.product_name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.product_price.toString().includes(filters.price) &&
      `${item.product_size}${item.quantity_measure}`
        .toLowerCase()
        .includes(filters.quantity.toLowerCase()) &&
      item.total_products.toString().includes(filters.total) &&
      item.product_category.toLowerCase().includes(filters.category.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="p-2 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Products List
          </h2>
          <p className="text-gray-600 mt-1">View and manage all products.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outlined" color="green" size="sm">
            View All
          </Button>
          <Link to={`/admin/addProduct`}>
            <Button color="green" size="sm" className="flex items-center gap-2">
              <BiSolidAddToQueue size={18} />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <Card className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full text-left text-gray-800">
          <thead className="bg-gray-100 border-b">
            <tr>
              {TABLE_HEAD.map((head, idx) => (
                <th
                  key={idx}
                  className="py-3 px-4 text-sm font-semibold tracking-wide"
                >
                  {head}
                </th>
              ))}
            </tr>

            {/* Filters */}
            <tr className="bg-gray-50">
              <td className="py-2"></td>
              {["name", "price", "quantity", "total", "category"].map((field) => (
                <td key={field} className="py-2 px-4">
                  <input
                    name={field}
                    value={filters[field]}
                    onChange={handleFilterChange}
                    placeholder={`Search ${field}`}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-gray-500 py-8 text-sm"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              currentProducts.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Product Image */}
                  <td className="p-4">
                    <Avatar
                      src={item?.product_image?.[0]}
                      alt={item.product_name}
                      size="sm"
                      variant="rounded"
                      className="border border-gray-300"
                    />
                  </td>

                  {/* Product Details */}
                  <td className="p-4 font-medium">{item.product_name}</td>
                  <td className="p-4">${item.product_price}</td>
                  <td className="p-4">
                    {item.product_size}
                    {item.quantity_measure}
                  </td>
                  <td className="p-4">{item.total_products}</td>
                  <td className="p-4">{item.product_category}</td>

                  {/* Edit Button */}
                  <td className="p-4">
                    <Link to={`/admin/updateProduct/${item._id}`}>
                      <BiSolidEditAlt
                        size={22}
                        className="text-blue-500 hover:text-blue-700 transition"
                      />
                    </Link>
                  </td>

                  {/* Delete Button */}
                  <td className="p-4">
                    <button onClick={() => handleDelete(item._id)}>
                      <MdDelete
                        size={20}
                        className="text-red-500 hover:text-red-700 transition"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          onPageChange={handlePageChange}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          containerClassName="flex justify-center mt-6 gap-2 flex-wrap"
          activeClassName="bg-green-500 text-white"
          pageClassName="border border-gray-300 px-3 py-1 rounded-md cursor-pointer hover:bg-green-100"
          previousLabel="Prev"
          nextLabel="Next"
          previousClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-green-100"
          nextClassName="px-3 py-1 border border-gray-300 rounded-md cursor-pointer hover:bg-green-100"
          breakLabel="..."
        />
      )}
    </div>
  );
}

export default AdminProducts;
