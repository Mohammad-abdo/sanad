# DataTable Component - Advanced Filters & Export Guide

## New Features

### 1. Advanced Filters
The DataTable now supports multiple filter types:
- **Text filters**: Search within specific columns
- **Select filters**: Dropdown selection for status, categories, etc.
- **Number filters**: Filter by numeric values
- **Date filters**: Filter by specific date
- **Date range filters**: Filter by date range (from/to)

### 2. Export Functionality
- **CSV Export**: Export filtered/sorted data to CSV
- **PDF Export**: Export filtered/sorted data to PDF with formatted table

## Usage Examples

### Basic Usage with Filters

```jsx
<DataTable
  data={usersList}
  columns={columns}
  filterable={true}
  filters={[
    {
      key: 'status',
      label: 'الحالة',
      type: 'select',
      options: [
        { value: 'active', label: 'نشط' },
        { value: 'inactive', label: 'غير نشط' }
      ]
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      type: 'text'
    },
    {
      key: 'createdAt',
      label: 'تاريخ التسجيل',
      type: 'dateRange'
    }
  ]}
  exportable={true}
  searchable={true}
/>
```

### Auto-Generated Filters

If you don't provide the `filters` prop, filters will be auto-generated from columns that have `filterable: true`:

```jsx
const columns = [
  {
    header: 'الاسم',
    accessor: 'name',
    filterable: true, // Will create a text filter
    filterType: 'text' // Optional: specify filter type
  },
  {
    header: 'الحالة',
    accessor: 'status',
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { value: 'active', label: 'نشط' },
      { value: 'inactive', label: 'غير نشط' }
    ]
  }
];

<DataTable
  data={data}
  columns={columns}
  filterable={true}
  exportable={true}
/>
```

### Filter Types

1. **Text Filter** (`type: 'text'`)
   - For searching text within a column
   - Example: Filter by name, email, etc.

2. **Select Filter** (`type: 'select'`)
   - For dropdown selection
   - Requires `options` array with `{ value, label }`
   - Example: Status, category, type

3. **Number Filter** (`type: 'number'`)
   - For exact number matching
   - Example: Filter by ID, count, etc.

4. **Date Filter** (`type: 'date'`)
   - For filtering by specific date
   - Example: Created date, updated date

5. **Date Range Filter** (`type: 'dateRange'`)
   - For filtering by date range
   - Shows "from" and "to" date inputs
   - Example: Date range for reports, bookings

### Export Features

The export functionality exports the **currently filtered and sorted data**:

- **CSV Export**: 
  - Includes all visible columns
  - Properly formatted with headers
  - File name: `{title}-{date}.csv`

- **PDF Export**:
  - Formatted table with headers
  - Includes title and export date
  - Alternating row colors
  - File name: `{title}-{date}.pdf`

### Complete Example

```jsx
import DataTable from '../../components/common/DataTable';

const UsersPage = () => {
  const columns = [
    {
      header: 'الاسم',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'البريد الإلكتروني',
      accessor: 'email',
      sortable: true
    },
    {
      header: 'الحالة',
      accessor: 'status',
      sortable: true,
      render: (row) => (
        <span className={row.status === 'active' ? 'text-green-600' : 'text-red-600'}>
          {row.status === 'active' ? 'نشط' : 'غير نشط'}
        </span>
      )
    },
    {
      header: 'تاريخ التسجيل',
      accessor: 'createdAt',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('ar-EG')
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'الحالة',
      type: 'select',
      options: [
        { value: 'active', label: 'نشط' },
        { value: 'inactive', label: 'غير نشط' },
        { value: 'pending', label: 'بانتظار' }
      ]
    },
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      type: 'text'
    },
    {
      key: 'createdAt',
      label: 'تاريخ التسجيل',
      type: 'dateRange'
    }
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      title="قائمة المستخدمين"
      searchable={true}
      filterable={true}
      filters={filters}
      exportable={true}
      pagination={true}
      pageSize={20}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filterable` | boolean | `false` | Enable filter panel |
| `filters` | array | `[]` | Custom filter configurations |
| `exportable` | boolean | `false` | Enable export menu (CSV/PDF) |
| `searchable` | boolean | `true` | Enable global search |
| `data` | array | `[]` | Data rows |
| `columns` | array | `[]` | Column definitions |
| `title` | string | `''` | Table title |
| `pagination` | boolean | `true` | Enable pagination |
| `pageSize` | number | `10` | Items per page |

## Notes

- Filters are applied in combination (AND logic)
- Export includes all filtered/sorted data, not just current page
- Date filters work with ISO date strings or Date objects
- The filter panel can be toggled on/off
- Active filter count is shown on the filter button

