import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../Components/Sidebar';
import { Button, Card, Input, Textarea, Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, getProducts, updateProduct } from '../../redux/productSlice';
import { useParams } from 'react-router-dom';
import upload from '/Images/upload.png';
function ProductForm() {
    const params = useParams();
    const { productId } = params;
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product);

    const [productData, setProductData] = useState({
        product_id: '',
        product_name: '',
        product_price: 0,
        product_size: 0,
        quantity_measure:'',
        total_products:0,
        product_category: '',
        cafe_category: '',
        outOfStock:false,
        product_description:'',
        product_images: [], // changed from single file to array
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setProductData({ ...productData, product_images: files });
        toast.success(`${files.length} image(s) uploaded successfully`);
    };
    useEffect(() => {
        console.log("Products in state:", productId);
        if (productId) {
            dispatch(getProducts());
            const selectedProduct = products.find((item) => item._id.toString() === productId);
            if (selectedProduct) {
              let parsedImages = [];
              try {
                parsedImages = selectedProduct.product_image;
              } catch (e) {
                console.warn("Image parsing failed:", e);
              }
              console.log("Selected Product:", selectedProduct);
    
              setProductData({
                product_id: selectedProduct._id,
                product_name: selectedProduct.product_name,
                product_price: selectedProduct.product_price,
                product_size: selectedProduct.product_size,
                quantity_measure: selectedProduct.quantity_measure,
                total_products: selectedProduct.total_products,
                outOfStock: selectedProduct.outOfStock,
                product_category: selectedProduct?.product_category,
                cafe_category: selectedProduct?.product_name?.split('#')[1],
                product_description: selectedProduct?.product_description,
                product_images: [],
                existing_images: parsedImages || [],
              });
            }
        }
      }, [dispatch, productId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("product_name", productData.product_name.split('#')[0]+'#'+productData.cafe_category);
        formData.append("product_price", productData.product_price === '' ? 0 : Number(productData.product_price));
        formData.append("product_size", productData.product_size === '' ? 0 : Number(productData.product_size));
        formData.append("quantity_measure", productData.quantity_measure);
        formData.append("total_products", productData.total_products === '' ? 0 : Number(productData.total_products));
        formData.append("product_category", productData.product_category);
        formData.append("outOfStock", productData.outOfStock);
        formData.append("product_description", productData.product_description);
        formData.append("existing_images", JSON.stringify(productData.existing_images));

        productData.product_images.forEach((img, idx) => {
            formData.append("product_images", img); // backend should handle multiple files
        });
        console.log("form_data",formData);
        if (productId) {
            formData.append("product_id", productData._id);
            await dispatch(updateProduct({formData,productId}));
            toast.success("Product updated successfully");
        } else {
            await dispatch(addProduct(formData));
            setProductData({product_id: '',
                product_name: '',
                product_price: 0,
                product_size: 0,
                quantity_measure:'',
                total_products:0,
                product_category: '',
                outOfStock:'',
                product_description:'',
                product_images: []})
        }
    };

    return (
        <div>
            <div className='pt-10  lg:flex items-center'>
                <Card shadow={true} className='mx-auto lg:px-10 pb-10'>
                    <form
                        className='text-center md:mt-10 flex sm:flex-row flex-col items-center gap-10 px-10 mx-auto'
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {/* Existing Images */}
                            {productData?.existing_images?.map((url, i) => (
                                <div key={`exist-${i}`} className="relative">
                                <img src={url} alt="existing" className="w-20 h-20 object-cover border rounded" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 text-xs rounded-full"
                                    onClick={() => {
                                    const updated = [...productData.existing_images];
                                    updated.splice(i, 1);
                                    setProductData({ ...productData, existing_images: updated });
                                    }}
                                >
                                    &times;
                                </button>
                                </div>
                            ))}

                            {/* New Uploads */}
                            {productData.product_images.map((file, i) => (
                                <div key={`new-${i}`} className="relative">
                                <img src={URL.createObjectURL(file)} alt="preview" className="w-20 h-20 object-cover border rounded" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 text-xs rounded-full"
                                    onClick={() => {
                                    const updated = [...productData.product_images];
                                    updated.splice(i, 1);
                                    setProductData({ ...productData, product_images: updated });
                                    }}
                                >
                                    &times;
                                </button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            <label htmlFor="fileInput" className="cursor-pointer w-20 h-20 flex items-center justify-center border-2 border-dashed rounded text-gray-500">
                                +
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            </div>


                        <div className='flex flex-col gap-6'>
                            <Typography variant="h4" color="blue-gray">
                                {productId ? 'Update Product' : 'Add Product'}
                            </Typography>
                            <Input
                                color="brown"
                                label='Product Name'
                                required
                                type='text'
                                value={productData?.product_name}
                                className='invalid:border-red-500'
                                onChange={(e) => setProductData({ ...productData, product_name: e.target.value })}
                            />

                            <Input
                                color="brown"
                                required
                                label='Price'
                                type='number'
                                className='invalid:border-red-500'
                                value={productData?.product_price}
                                onChange={(e) => setProductData({ ...productData, product_price: e.target.value })}
                            />

                            <Input
                                color="brown"
                                label='Volume eg: 2lb,3oz'
                                type='number'
                                required
                                className='invalid:border-red-500'
                                placeholder='eg: 2lb,3oz'
                                value={productData?.product_size}
                                onChange={(e) => setProductData({ ...productData, product_size: e.target.value })}
                            />

                            <select
                                className="border border-gray-400 rounded-md p-2 text-sm invalid:border-red-500"
                                value={productData?.quantity_measure}
                                required
                                onChange={(e) => setProductData({ ...productData, quantity_measure: e.target.value })}
                            >
                                <option value="">Select Quantity Measure</option>
                                <option value="lb">lb</option>
                                <option value="kg">kg</option>
                                <option value="oz">oz</option>
                                <option value="each">each</option>
                                <option value="piece">piece</option>
                                <option value="L">L</option>
                                <option value="gal">gal</option>
                            </select>

                            <Input
                                color="brown"
                                label='No of Items'
                                type='number'
                                value={productData?.total_products}
                                onChange={(e) => setProductData({ ...productData, total_products: e.target.value })}
                            />

                            <select
                                className="border border-gray-400 rounded-md p-2 text-sm invalid:border-red-500"
                                value={productData?.product_category}
                                required
                                onChange={(e) => setProductData({ ...productData, product_category: e.target.value })}
                                >
                                <option value="">Select Category</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="cafe">Cafe</option>
                                <option value="food">Food</option>
                                <option value="meat">Meat</option>
                            </select>
                            {productData?.product_category==='cafe' && <select
                                className="border border-gray-400 rounded-md p-2 text-sm invalid:border-red-500"
                                required
                                value={productData?.cafe_category}
                                onChange={(e) => setProductData({ ...productData, cafe_category: e.target.value })}
                                >
                                <option value="">Cafe Category</option>
                                <option value="Appetizers">Appetizers</option>
                                <option value="Deserts">Deserts</option>
                                <option value="Drinks">Drinks & Juices</option>
                                <option value="Shawarmas & Gros">Shawarmas & Gros</option>
                                <option value="Specialities">Specialities</option>
                            </select>}

                            <select
                                className="border border-gray-400 rounded-md p-2 text-sm invalid:border-red-500"
                                value={productData?.outOfStock}
                                required
                                onChange={(e) => setProductData({ ...productData, outOfStock: e.target.value })}
                                >
                                <option value="">Select Product</option>
                                <option value="false">Active</option>
                                <option value="true">outOfStock</option>
                                
                            </select>
                            <Textarea rows={5} placeholder='description of product' value={productData?.product_description} onChange={(e)=>setProductData({...productData,product_description:e.target.value})}>
                            </Textarea>

                            <Button color="brown" type='submit'>Submit</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default ProductForm;
