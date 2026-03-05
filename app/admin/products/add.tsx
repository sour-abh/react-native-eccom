import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Switch, Image, ActivityIndicator, Modal, FlatList, TouchableWithoutFeedback } from "react-native";
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {COLORS} from "@/assets/constants";
import { useAuthStore } from "@/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductResource from "@/api/ProductResource";
import CategoryResource from "@/api/CategoryResource";
interface CategoryInterface{
  id:string
  name:string
  description?:string|null
  slug:string
  imageUrl?:string|null
  isActive:boolean
  createdAt:Date
  updatedAt:Date
  productCount:number
}
export default function AddProduct() {

    const {user}=useAuthStore.getState()

    const [submitting, setSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categoryName,setCategoryName]=useState('Women')
    const [categories,setCategories]=useState<CategoryInterface[]>([])
    const [sizes, setSizes] = useState<string>("");
    const [sku,setSku]=useState<string>('')
    const [images, setImages] = useState<string[]>([]);
    const [isFeatured, setIsFeatured] = useState(false);
    
    const fetchCategories=async()=>{
      try{
      const res=await CategoryResource.getAllCategories({})
      if(res.status===200){
        setCategories(res.data.data)
      }
      }
    catch (err){
      Toast.show({
        type:'error',
        text1:'error fetching categories',
        text2:`${ err}`
      })

    }
      
    }

    useEffect(()=>{
      fetchCategories()
    },[])

    // PICK MULTIPLE IMAGES (MAX 5)
    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 0.8,
        });

        if (!result.canceled) {
            const uris = result.assets.map((asset) => asset.uri);
            setImages(uris.slice(0, 5));
        }
    };

    // Add Product
    const handleSubmit = async () => {
        setSubmitting(true)
        try{
            
        if (!name || !price || !categoryId || sizes.length < 1) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all required fields'
            });
            setSubmitting(false)
            return;
        }
        
        const sizeArray = sizes.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
        
        const res = await ProductResource.createProducts({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            categoryId,
            sizes: sizeArray,
            isFeatured,
            imageUrl:images,
            sku
        })
        
        if(res.status === 200 || res.status === 201){
            Toast.show({
                type:'success',
                text1:'Product added successfully',
                text2:'Product has been created'
            })
            // Reset form
            setName("")
            setDescription("")
            setPrice("")
            setStock("")
            setCategoryId('')
            setSizes("")
            setImages([])
            setIsFeatured(false)
        }

    }
        catch (error: any){
            console.log('Error creating product:', error.response?.data || error.message);
            Toast.show({
                type:'error',
                text1:'Error creating product',
                text2: error.response?.data?.message || error.message || 'Something went wrong'
            })
        }
        finally {
            setSubmitting(false)
        }

    };
        if(user.role!=='ADMIN'){
    return(<SafeAreaView className="flex-1 bg-surface items-center">
        <View className="flex-1 items-center justify-center">
            <Text className="text-3xl text-bold text-gray-800">
                Admin Access only
            </Text>
        </View>
    
    </SafeAreaView>)
    }

    return (
        <ScrollView className="flex-1 bg-surface p-4">
            <View className="bg-white p-4 rounded-xl shadow-sm mb-20">
                {/* NAME */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Product Name *
                </Text>
                <TextInput
                    className="bg-surface p-3 rounded-lg mb-4 text-primary"
                    placeholder="e.g. Wireless Headphones"
                    value={name}
                    onChangeText={setName}
                />
                                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    SKU *
                </Text>
                <TextInput
                    className="bg-surface p-3 rounded-lg mb-4 text-primary"
                    placeholder="e.g. WH-100 store keeping unit "
                    value={sku}
                    onChangeText={setSku}
                />

                {/* PRICE */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Price ($) *
                </Text>
                <TextInput
                    className="bg-surface p-3 rounded-lg mb-4 text-primary"
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                />

                {/* CATEGORY */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Category
                </Text>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="bg-surface p-3 rounded-lg mb-4 flex-row justify-between items-center"
                >
                    <Text className="text-primary">{categoryName}</Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
                </TouchableOpacity>

                {/* CATEGORY MODAL */}
                <Modal visible={modalVisible} animationType="slide" transparent>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View className="flex-1 justify-end bg-black/50">
                            <View className="bg-white rounded-t-2xl p-4 max-h-[50%]">
                                <Text className="text-lg font-bold text-center mb-4">
                                    Select Category
                                </Text>

                                <FlatList
                                    data={categories}
                                    keyExtractor={(item) => String(item.id)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            className={`p-4 border-b ${categoryId === item.id ? "bg-primary/5" : ""
                                                }`}
                                            onPress={() => {
                                                setCategoryId(item.id);
                                                setCategoryName(item.name)
                                                setModalVisible(false);
                                            }}
                                        >
                                            <View className="flex-row justify-between">
                                                <Text
                                                    className={`${categoryId === item.id ? "font-bold text-primary" : ""
                                                        }`}
                                                >
                                                    {item.name}
                                                </Text>
                                                {categoryId === item.id && (
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={20}
                                                        color={COLORS.primary}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* STOCK */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Stock Level
                </Text>
                <TextInput
                    className="bg-surface p-3 rounded-lg mb-4 text-primary"
                    placeholder="0"
                    keyboardType="number-pad"
                    value={stock}
                    onChangeText={setStock}
                />

                {/* SIZES */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Sizes (comma separated)
                </Text>
                <TextInput
                    className="bg-surface p-3 rounded-lg mb-4 text-primary"
                    placeholder="e.g. S, M, L, XL"
                    value={sizes}
                    onChangeText={setSizes}
                />

                {/* IMAGE PICKER */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Product Images (max 5)
                </Text>

                <TouchableOpacity onPress={pickImages} className="mb-4">
                    {images.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {images.map((uri, i) => (
                                <Image
                                    key={i}
                                    source={{ uri }}
                                    className="w-32 h-32 rounded-lg mr-2"
                                />
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="w-full h-32 rounded-lg bg-gray-100 justify-center items-center border border-dashed border-gray-300">
                            <Ionicons
                                name="cloud-upload-outline"
                                size={32}
                                color={COLORS.secondary}
                            />
                            <Text className="text-secondary text-xs mt-2">
                                Tap to upload images
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* DESCRIPTION */}
                <Text className="text-secondary text-xs font-bold mb-1 uppercase">
                    Description
                </Text>
                <TextInput
                    className="bg-surface p-3 rounded-lg mb-6 text-primary h-24"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                {/* FEATURED */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-primary font-bold">Featured Product</Text>
                    <Switch
                        value={isFeatured}
                        onValueChange={setIsFeatured}
                        trackColor={{ false: "#eee", true: COLORS.primary }}
                    />
                </View>

                {/* SUBMIT */}
                <TouchableOpacity
                    onPress={()=>handleSubmit()}
                    disabled={submitting}
                    className={`bg-primary p-4 rounded-xl items-center ${ submitting ? "opacity-70" : ""
                        }`}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">
                            Create Product
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
