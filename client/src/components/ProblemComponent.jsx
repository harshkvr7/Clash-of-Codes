import { useMemo } from "react";
import ShadowWrapper from "./ShadowWrapper";

const ProblemComponent = ({ problemHTML }) => {
    const extractedContent = useMemo(() => {
        if (!problemHTML) return "No problem content available.";

        const customStyle = `<style>#sidebar { display: none !important; } 
                                #header { display: none !important; }
                                .menu-list-container { display: none !important; }
                                #footer { display: none !important; }
                                .second-level-menu-list { display: none !important; }
                                .menu-box { display: none !important; }
                                #pageContent.content-with-sidebar { margin-right: 0px !important; }
                                #pageContent { padding-top: 0px !important; }
                                .ttypography { margin : 0px !important;}
                                #body {padding-top : 0px !important;}
                            </style>`;
        return customStyle + problemHTML;
    }, [problemHTML]);

    return <ShadowWrapper html={extractedContent} />;
};

export default ProblemComponent;
