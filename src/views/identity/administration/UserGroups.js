import React from 'react'
import PropTypes from 'prop-types'
import { CCard, CCardBody, CCardHeader, CCardTitle, CLink, CSpinner } from '@coreui/react'
import { CellBoolean, CippDatatable } from 'src/components/cipp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { useListUserGroupsQuery } from 'src/store/api/groups'

const formatter = (cell) => CellBoolean({ cell })

const columns = [
  {
    name: 'Display Name',
    selector: (row) => row['DisplayName'],
    exportSelector: 'DisplayName',
    formatter: (cell, row) => {
      return (
        <CLink
          href={`https://aad.portal.azure.com/${row.tenantDomain}/#blade/Microsoft_AAD_IAM/GroupDetailsMenuBlade/Overview/groupId/${row.id}`}
        >
          {row.DisplayName}
        </CLink>
      )
    },
  },
  {
    name: 'Mail Enabled',
    selector: (row) => row['MailEnabled'],
    exportSelector: 'MailEnabled',
    formatter,
  },
  {
    name: 'Email Address',
    selector: (row) => row['Mail'],
    exportSelector: 'Mail',
  },
  {
    name: 'Security Group',
    selector: (row) => row['SecurityGroup'],
    exportSelector: 'SecurityGroup',
    formatter,
  },
  {
    name: 'Group Types',
    selector: (row) => row['GroupTypes'],
    exportSelector: 'GroupTypes',
  },
  {
    name: 'On Premises Sync',
    selector: (row) => row['OnPremisesSync'],
    exportSelector: 'OnPremisessSync',
    formatter,
  },
  {
    name: 'Assignable To Role',
    selector: (row) => row['IsAssignableToRole'],
    exportSelector: 'IsAssignableToRole',
    formatter,
  },
]

export default function UserGroups({ userId, tenantDomain, className }) {
  const { data: list = [], isFetching, error } = useListUserGroupsQuery({ userId, tenantDomain })

  // inject tenantDomain into list for formatter
  const mapped = list.map((val) => ({ ...val, tenantDomain }))

  return (
    <CCard className={`options-card ${className}`}>
      <CCardHeader className="d-flex justify-content-between">
        <CCardTitle>User Groups</CCardTitle>
        <FontAwesomeIcon icon={faUsers} />
      </CCardHeader>
      <CCardBody>
        {isFetching && <CSpinner />}
        {!isFetching && error && <>Error loading groups</>}
        {!isFetching && !error && (
          <CippDatatable
            path="/api/ListUserGroups"
            params={{ tenantFilter: tenantDomain, userId }}
            keyField="id"
            columns={columns}
            data={mapped}
            striped
            bordered={false}
            dense
            responsive={true}
            disablePDFExport={true}
            disableCSVExport={true}
          />
        )}
      </CCardBody>
    </CCard>
  )
}

UserGroups.propTypes = {
  userId: PropTypes.string.isRequired,
  tenantDomain: PropTypes.string.isRequired,
  className: PropTypes.string,
}
