import { documentStatus } from "@root/config/constant";
import to from "await-to-js";
import { useEffect, useState } from "react";
import { getCountByStatus } from "../helpers/utils";
import documentService from "../services/documentService";
import useBaseHooks from "./BaseHook";

const useStatusCount = () =>{
    const {t, redirect, notify} = useBaseHooks();
    const [document, setDocuments] = useState(null);
	const [statusCount, setStatusCount] = useState(null);


    const fetchData = async (values: any) => {

		let [error, documents]: [any, any] = await to(
			documentService().withAuth().index(values)
		);

		if (error) {
			const { code, message } = error;
			notify(t(`errors:${code}`), t(message), "error");
			return {};
		}
		const countbystatus =  await getCountByStatus(documents?.data);
		// const len = Object.keys(countbystatus).filter(item =>item != null)
		Object.keys(countbystatus).map((item) => {
			if(documentStatus.hasOwnProperty(item)){
				// re-name object keys
				countbystatus[documentStatus[item]] = countbystatus[item];
				// delete previous key
				delete countbystatus[item];

			}
			
			
		});

		setStatusCount(countbystatus);
		setDocuments(documents.total)
		return documents;
	};
    // fetchData();
    useEffect(()=>{
        fetchData()
    }, [])
    return {
        ...statusCount,
        total: document
    }
}



export default useStatusCount;