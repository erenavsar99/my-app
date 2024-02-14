import React, { useState, useEffect } from "react";
import "dayjs/locale/tr";
import dayjs from 'dayjs';
import locale from "antd/es/date-picker/locale/tr_TR";
import {
  Button,
  Select,
  Input,
  Form,
  Col,
  Row,
  Space,
  DatePicker,
  Drawer,
  Modal,
  message,
} from "antd";
import LibraryService from "../services/LibraryService";
const dateFormatList = ["DD-MM-YYYY"];


const FormItem = Form.Item;
export default function Entrustee({selectedRecord, open, onClose, setTableDataRenderDependency}){
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onUpdateBook = async(values)=>{
      console.log(values)
      
      // console.log(endDate)
      const entrustee = values.entrustee
      const id = selectedRecord.id
      const endDate = values.date
      const form = {
        entrustee,
        endDate,
        id
      }
      // form.id = selectedRecord.id
      // entrustee = values.entrustee
      // endDate = values.date
      console.log(form)
      LibraryService.giveBook(form).then((response)=>{
        if(response.status === 200)
        setTableDataRenderDependency(true);
      else
      messageApi.error("Kitap Ödünç Verilirken Hata Meydana Geldi!");
      })
    }



    return(
      <>
      {contextHolder}
      
        <Drawer
        title="Kitap Ödünç Al"
        width={600}
        open={open}
        destroyOnClose={true}
        onClose={onClose}
        extra={
          <Space>
            <Button onClick={onClose}>Vazgeç</Button>
            <Button
              onClick={() => {
                form.validateFields().then((values) => {
                  form.resetFields();
                  onUpdateBook(values);
                  onClose()
                });
              }}
            >
              Kaydet
            </Button>
          </Space>
        }
      >
        <Form
        labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 38,
          }}
          form={form}
          initialValues={{
          }}
          layout="vertical"
        >
            <Row>
            <Col span={12}>
              <FormItem
                label="Ödünç Alınmak İstenen Kitap"
                name="name"
                disabled
              >
                <Input defaultValue={selectedRecord.name + " - " + selectedRecord.author } disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="Kitabı Alacak Kişinin Adı ve Soyadı"
                name="entrustee"
                rules={[
                  {
                    required: true,
                    message: "Bu Alan Zorunludur!",
                  },
                ]}
              >
                <Input ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
          <Col span={12} >
              <FormItem
              name="date"
                label="Kitabın Teslim Edileceği Tarih"
                rules={[
                  {
                    required: true,
                    message: "Başlangıç tarihi giriniz.",
                  },
                ]}
              >
                <DatePicker
                format={dateFormatList}
                locale={locale}
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>

        </Form>

      </Drawer>
      </>
    )
}
