import React from 'react';
import {NavigationItemGroup} from "@evershop/evershop/components/admin";
import PropTypes from 'prop-types';

export default function SevenMenuGroup({ sevenBulk }) {
    return (
        <NavigationItemGroup
            id="sevenMenuGroup"
            name="seven"
            items={[
                {
                    Icon: () => '7',
                    url: sevenBulk,
                    title: 'Bulk Messaging'
                }
            ]}
        />
    );
}

SevenMenuGroup.propTypes = {
    sevenBulk: PropTypes.string.isRequired
};


export const layout = {
    areaId: 'adminMenu',
    sortOrder: 40
};

export const query = `
  query Query {
    sevenBulk: url(routeId:"sevenBulk")
  }
`;
