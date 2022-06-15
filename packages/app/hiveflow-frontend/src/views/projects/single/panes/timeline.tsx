import { Timeline } from "@hexhive/ui";
import React, { useState } from "react";

export const TimelinePane = () => {
    const [ links, setLinks ] = useState([]);

    return (
        <Timeline
            data={[
              {id: '1', start: new Date(), end: new Date(2022, 4, 10), name: "Item 1", color: 'red', showLabel: true},
              {id: '2', start: new Date(), end: new Date(2022, 10, 12), name: "Item 1", color: 'red', showLabel: true},
            ]}
            links={links}
            onCreateLink={(link) => {
              setLinks([...links, link])
            }}
             
          />
    )
}