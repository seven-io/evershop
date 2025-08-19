import {Card} from "@evershop/evershop/components/admin";
import React from "react";

export default function SevenBulk({saveSevenBulkApi}: { saveSevenBulkApi: string }) {
    return <div className='main-content-inner'>
        <form method='POST' id='sevenBulk' action={saveSevenBulkApi}>
            <Card>
                <Card.Session title='Bulk Messaging'>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <label htmlFor='from'>From</label>
                        <input
                            id='from'
                            name='from'
                            placeholder='EverShop'
                            //defaultValue={storeName}
                        />
                    </div>


                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <label htmlFor='text'>Text</label>
                        <textarea
                            id='text'
                            name='text'
                            placeholder='Dear {{full_name}}!'
                            //defaultValue={storeDescription}
                            required
                        ></textarea>
                    </div>

                    <button type='submit'>Submit</button>
                </Card.Session>
            </Card>
        </form>
    </div>
}

export const layout = {
    areaId: 'content',
    sortOrder: 10
};

export const query = `
  query Query {
    saveSevenBulkApi: url(routeId: "saveSevenBulk")
  }
`;
