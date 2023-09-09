import React from "react";
import { Site as SiteModel } from "../models/category";

interface SiteProps {
    site: SiteModel
}

const Site: React.FC<SiteProps> = ({ site }) => {
    return (
        <div>
            <p>{ site.title }</p>
            <p>{ site.url }</p>
        </div>
    );
};

export default Site;