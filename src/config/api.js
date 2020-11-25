const baseUrl = "http://10.32.5.88:8099/";



export const ImagesAPI = `${baseUrl}image/upload`;       //商品图片添加
export const GetImageApi = `${baseUrl}image/get-image`;  //获取图片


/* 登录登出 */
export const LoginAPI = `${baseUrl}auth/login`;        //登录
export const LogoutAPI = `${baseUrl}auth/logout`;      //退出登录
/* 会员管理 */
export const UserListAPI = `${baseUrl}member/index`;                //会员列表
export const EditUserStatusAPI = `${baseUrl}member/edit-status`;    //修改会员状态
export const UserDetailAPI = `${baseUrl}member/info`;               //会员详情

/* 物料管理 */
export const CarrierListAPI = `${baseUrl}carrier/index`;                //物流公司列表
export const AddCarrierAPI = `${baseUrl}carrier/add`;                   //创建物流公司
export const EditCarrierAPI = `${baseUrl}carrier/edit`;                 //编辑物流公司
export const DeleteCarrierAPI = `${baseUrl}carrier/delete`;             //删除物流公司
export const EditCarrierStatusAPI = `${baseUrl}carrier/edit-status`;    //编辑物流公司状态

/* 商品标签 */
export const ProductTagListAPI = `${baseUrl}product-tag/index`;       //商品标签列表
export const AddProductTagAPI = `${baseUrl}product-tag/add`;          //创建商品标签
export const EditProductTagAPI = `${baseUrl}product-tag/edit`;        //编辑商品标签
export const DeleteProductTagAPI = `${baseUrl}product-tag/delete`;    //删除商品标签

/* 商品参数 */
export const ProductParamListAPI = `${baseUrl}product-param/index`;         //商品参数列表
export const AddProductParamAPI = `${baseUrl}product-param/add`;            //创建商品参数
export const EditProductParamAPI = `${baseUrl}product-param/edit`;          //编辑商品参数
export const DelProductParamAPI = `${baseUrl}product-param/del`;            //删除商品参数
export const ProductParamDetailAPI = `${baseUrl}product-param/detail`;      //商品参数详情
export const ProductParamBindableAPI = `${baseUrl}product-param/bindable-params`;      //获取可被绑定类型的参数列表


/* 商品规格 */
export const ProductSpecListAPI = `${baseUrl}product-spec/index`;       //商品规格列表
export const AddProductSpecAPI = `${baseUrl}product-spec/add`;          //创建商品规格
export const EditProductSpecAPI = `${baseUrl}product-spec/edit`;        //编辑商品规格
export const DeleteProductSpecAPI = `${baseUrl}product-spec/delete`;    //删除商品规格
export const ProductSpecBindableAPI = `${baseUrl}product-spec/bindable-specs`;    //获取可被绑定类型的规格列表


/* 商品类型 */
export const ProductKindListAPI = `${baseUrl}product-kind/index`;           //商品类型列表
export const AddProductKindAPI = `${baseUrl}product-kind/add`;              //创建商品类型
export const EditProductKindAPI = `${baseUrl}product-kind/edit`;            //编辑商品类型
export const DeleteProductKindAPI = `${baseUrl}product-kind/delete`;        //删除商品类型
export const ParamByProductKindAPI = `${baseUrl}product-kind/bind-param`;   //商品类型绑定类型参数
export const SpecByProductKindAPI = `${baseUrl}product-kind/bind-spec`;     //商品类型绑定规格参数

/* 商品分类 */
export const ProductCategoryListAPI = `${baseUrl}product-category/index`;               //商品分类列表
export const AddProductCategoryAPI = `${baseUrl}product-category/add`;                  //创建商品分类
export const EditProductCategoryAPI = `${baseUrl}product-category/edit`;                //编辑商品分类
export const DeleteProductCategoryAPI = `${baseUrl}product-category/delete`;            //删除商品分类
export const EditStatusProductCategoryAPI = `${baseUrl}product-category/edit-status`;   //编辑商品分类状态

/* 商品列表 */
export const ProductListAPI = `${baseUrl}product/index`;               //商品列表
export const AddProductAPI = `${baseUrl}product/add`;               //创建商品
export const EditProductAPI = `${baseUrl}product/edit`;               //编辑商品
export const DeleteProductAPI = `${baseUrl}product/delete`;               //删除商品

/* 订单列表 */
export const OrderListAPI = `${baseUrl}order/index`;               //订单列表
export const OrderShipmentAPI = `${baseUrl}shipment/add`;               //订单发货
export const OrderStatusAPI = `${baseUrl}order/status`;               //订单状态

/* 广告位列表 */
export const BannerListAPI = `${baseUrl}banner/index`;               //广告位列表
export const DeleteBannerAPI = `${baseUrl}banner/delete`;            //删除广告位
export const AddBannerAPI = `${baseUrl}banner/add`;                  //创建广告位
export const EditBannerAPI = `${baseUrl}banner/edit`;                //编辑广告位
export const EditBannerStatusAPI = `${baseUrl}banner/edit-status`;   //编辑广告位状态






