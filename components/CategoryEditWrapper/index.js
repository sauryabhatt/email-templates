import React from 'react'
import { useCookies } from "react-cookie";
import FeedbackModal from "../FeedbackModal/FeedbackModal";


function CategoryEditWrapper({body}) {
const [cookie, setCookie] = useCookies(["qalaraUser"]);

    return (
        <div>
            {cookie.qalaraUser && cookie.qalaraUser !== "oldUser" && (
                <FeedbackModal />
            )}
            <div
                dangerouslySetInnerHTML={{ __html: body }}
                style={{ paddingTop: "3%" }}
            >
            </div>
        </div>
    )
}

export default CategoryEditWrapper
