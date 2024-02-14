import  React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Select,
  Input,
  Form,
  Upload,
  Table,
  Space,
  Modal,
  Row,
  Col,
  message,
  Drawer
} from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import LibraryService from "../services/LibraryService";
import Entrustee from './Entrustee';
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

export default function Main(){
    const [selectedRecord, setSelectedRecord] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [tableDataRenderDependency, setTableDataRenderDependency] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    useEffect(() => {
        if(tableDataRenderDependency===true){
          messageApi.success("Kitap Ödünç Verilmiştir!");
          setTableDataRenderDependency(false)
        }
        setTableLoading(true)
            
        GetBooksList();
      }, [tableDataRenderDependency]);

      const GetBooksList = async () =>{
        LibraryService.getBooks().then((response)=>{
          setDataSource(response.data)
        })
        setTableLoading(false);
      }

      const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Ara
              </Button>
              <Button
                onClick={() => {
                  clearFilters && handleReset(clearFilters);
                  handleSearch(selectedKeys, confirm, "");
                }}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Temizle
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? "#1890ff" : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
      });


    const columns =  [
        {
            title: "İsim",
            dataIndex: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Yazar",
            dataIndex: "author",
            ...getColumnSearchProps("author"),
        },
        {
            title: "Görsel",
            dataIndex: "imageFile",
            render: (image)=>{ return <img style={{width:"50px"}} src={`data:image/jpeg;base64,${image}`} />}
        },
        {
            title: "Mevcut",
            dataIndex: "isAvailable",
            filters: [
                {
                  text: "Dışarıda",
                  value: false,
                },
                {
                  text: "Mevcut",
                  value: true,
                },
              ],
              onFilter: (value, record) => record.isAvailable === value,
              render: (info) => {
                return <p>{info === true ? "Mevcut" : "Dışarıda"}</p>;
              },
        },
        {
            title: "Kitabı Alan Kişi",
            dataIndex: "entrustee"
        },
        {
            title: "Teslim Edileceği Tarih",
            dataIndex: "endDate",
            render: (endDate) => {
              if(endDate!==null)
              return <p>{endDate.substring(0, 10)}</p>;
            },
        },
        {
            title: "İşlemler",
            dataIndex: "operators",
            render: (_, record) => {
              return (
                <>
<Row gutter={24}>
  <Col className='text-center' span={24}>
  <EditOutlined
                      style={{ color: "black", textAlign:"center"}}
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsDrawerOpen(true);
                      }}
                    />
  </Col>
</Row>
                    
                </>
              );
            },
          },
]

const handleReset = (clearFilters) => {
  clearFilters();
  setSearchText("");
};

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

const OnCreateBook = async(values)=>{
  const newRequest = new FormData();
  newRequest.append("name", values.name);
  newRequest.append("author", values.author);
  newRequest.append("media", fileList[0]);
  LibraryService.createBook(newRequest).then((response) => {
    console.log(response)
    if(response.status === 200){
      messageApi.success("Kitap Eklendi!");
      setTableLoading(true)
      GetBooksList()
    }
  else
  messageApi.error("Kitap Eklenirken Hata Oluştu!");
  });
}

const props = {
  onRemove: (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  },
  beforeUpload: (file) => {
    setFileList([file]);
    return false;
  },
  fileList,
};

const AddBook = ({open, onCancel})=>{
  return(
    <Modal
    open={open}
    okText="Kaydet"
    cancelText="Vazgeç"
    onCancel={() => {
      form.resetFields();
      onCancel();
    }}
    onOk={() => {
      form.validateFields().then((values) => {
        form.resetFields()
        OnCreateBook(values);
      });
      onCancel();
    }}
    >
      <Form
      form={form}
      layout="vertical"
      name="form_in_modal"
      >
        <Row>
        <Form.Item
              name="name"
              label="Kitap Adı"
              style={{ width: "44%" }}
              rules={[
                {
                  required: true,
                  message: "Lütfen kitap adı giriniz!",
                },
              ]}
            >
              <Input
                placeholder={"Giriniz..."}/>
            </Form.Item>
            </Row>
            <Row>
            <Form.Item
              name="author"
              label="Yazar"
              style={{ width: "44%" }}
              rules={[
                {
                  required: true,
                  message: "Lütfen yazar adı giriniz!",
                },
              ]}
            >
              <Input
                placeholder={"Giriniz..."}/>
            </Form.Item>
        </Row>
        <Row>
        <Col span={12}>
            <Form.Item name="image" label="Soru Görseli Yükle">
              <Upload
               accept="image/png, image/jpeg, image/jpg"
                maxCount={1}
                {...props}
              >
                <Button icon={<UploadOutlined />} style={{ width: "200px" }}>
                  Yüklemek İçin Tıklayın
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

      </Form>

    </Modal>
  )
}


  return (
    <>
    {contextHolder}
    <Button onClick={() => {
            setOpen(true);
          }}
                  style={{ float: "right", width: "10%", margin:"20px" }}
                  type="primary">Kitap Ekle</Button>
    
    <Table columns={columns} loading={tableLoading} dataSource={dataSource} style={{margin:"30px"}}/>

    <AddBook
        open={open}
        onCreate={AddBook}
        onCancel={() => {
          setOpen(false);
        }}
      />

    <Drawer open={isDrawerOpen} closable={true} destroyOnClose={true}>
        <Entrustee
          tableDataRenderDependency={tableDataRenderDependency}
          setTableDataRenderDependency={setTableDataRenderDependency}
          closable={true}
          destroyOnClose={true}
          selectedRecord={selectedRecord}
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  )
}

