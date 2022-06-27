create database City;
use City;

---tao bang ThanhPho
create table ThanhPho (
	ID_ThanhPho int(3) not null auto_increment primary key,
	tenThanhPho varchar(40) not null, 
    quocGia varchar(40) not null,
    dienTich int (16),
    danSo int (16),
    GDP int(3),
    gioiThieu varchar (255)
);

insert into ThanhPho(tenThanhPho, quocGia, dienTich, danSo, GDP, gioiThieu) 
values ('Ha Noi', 'Viet Nam', 10000, 3000000, 50, 'xinh dep');

insert into ThanhPho(tenThanhPho, quocGia, dienTich, danSo, GDP, gioiThieu) 
values ('Da Nang', 'Viet Nam', 30000, 30000, 60, 'tuyet voi');

delimiter //
CREATE PROCEDURE update_ThanhPho (ten varchar(40),
								quocgia varchar(40),
                                dientich INt,
                                danso INT,
                                gdp INT,
                                gioithieu varchar(255)
)
  BEGIN
    update ThanhPho set tenThanhPho = ten where ID_ThanhPho = id; 
    update ThanhPho set quocGia = quocgia where ID_ThanhPho = id; 
    update ThanhPho set dienTich = dientich where ID_ThanhPho = id; 
    update ThanhPho set danSo = danso where ID_ThanhPho = id; 
    update ThanhPho set GDP = gdp where ID_ThanhPho = id; 
    update ThanhPho set gioiThieu = gioithieu where ID_ThanhPho = id; 
  END//
delimiter ;
