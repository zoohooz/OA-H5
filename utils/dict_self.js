import { getDicts } from "@/api/system/dict/data";

// 获取字典作为单选数据源
export async function getDictsList(name) {
	return await getDicts(name).then(res =>{
		 return res.data.map(ele =>{
			return {
				text: ele.dictLabel,
				value: ele.dictValue,
				disable: false,
			}
		});
	})
}