import React from "react";
import { Box } from "@mui/material";
import LogoCamera from "../../public/img/camera_photo2.png";
import { Dispatch, SetStateAction } from "react";
import { getDevice  } from "../utils/utils";


type Props = {
  editMode: boolean;
  logoImageBase64: string;
  setLogoImageBase64: Dispatch<SetStateAction<string>>;
  setFormDataForImageUpload: any;
  previewImage: any;
  setPreviewImage: any;
};

const ManageAdminProfilePicUpload = (props: Props) => {
  const {
    setFormDataForImageUpload,
    previewImage,
    setPreviewImage,
    logoImageBase64
  } = props;

//   let Avatar = LocalStorageService.getUserProfilePic();

  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleChangeImage = async (e: any) => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (file && file.type && file.type.startsWith("image/")) {
      reader.onloadend = () => {
        myFile.file = file;
        myFile.imagePreviewUrl = reader.result;
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("avatarimage", file);
      setFormDataForImageUpload(formData);
    }
  };

  const { isMobile } = getDevice()

  return (
    <>
      {previewImage && (
        <img
          src={previewImage}
          style={{
            position: "absolute",
            opacity: props.editMode ? 1 : 0,
            width: isMobile ? '110px' : '130px',
            height: isMobile ? '110px' : '130px',
            border: "solid white 6px",
            borderRadius:"50%"
          }}
        />
      )}
      <img
        src={
          `data:image/jpeg;charset=utf-8;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAGQAZADASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAcBAgQFBgMI/8QARRAAAQMCAgYGCAQFAgQHAAAAAAECAwQRBQYHEhMhMUFRcZGhscEUIjIzUmGB0SNCYnIVNFNz4SRjFiWisjVDRGSCkuL/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAfEQEAAgMBAAMBAQAAAAAAAAAAAQIREjEhMkFRE0L/2gAMAwEAAhEDEQA/AJFAB9J4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAVc2zrIFRET5jJhQABAAAAAAAAAAAAAAAAAAAAAFOIA5AAAAAAAAAAWve2NLvcjU+a2MKoxzCqW+3xGnZbksiXKuJZ4Oenz1l2D/ANftPlGxXGun0m4PH7mColt+lG3GJWKy7IEdVGlV+9KfCm9ckv2Q1tRpMxuRfwY6eFPkzW8S6yukpXBC82eMxT+1iLmJ+hjW+RrajGMTqr7evqH35LIpdJXROctZSwIqy1EbLfE5ENfPmvAab3mKQX6Gu1l7iEHKrlu5VcvSq3KWsXRdEu1GkbL8C2ZJNMv6I1t3mtn0qUbb+j4bNJ83vRpGhW41hdISRh+lCKetZFWYfsIXrbaNk1tXrSx3qKjkRUW6LwPnknbL0/pWXqCdVur4G367W8iWjDN6xHGxABhzAAAAKtS/HgBREuqFXblC2R24q5LpdCKrfW3pxKatrqq7y0DAAArIAAAAAAAAAAAAAAAAAAAACh5yTwwpeWVkafqcieJSqlWCkmmal1jjc5E6VRLkEYhidZiVXJUVU8kjnuVbOcqonyRORYjLVa5TXUZiwan97idMipySVFU1FTpDwGnVUZLJMqfAwiHgXbnp0O8TcUdNISRPpTpG7oMMlk+b5Eb5Ka2o0o1777Cghi6NZyuOHVLFC6wukOmn0hZjmX1aqOJP0Qt8zXz5px2p97ik69So3wNSC4hrEPaWqqZ1vLPI/wDc5VPGydAAwAAKAAAAAAAVAoAABMmQp1nyjSIq32eszsUhslLRjUbTAqiFV3xTcPkqGL8YvxuFzpgLZ3wyVyRvjcrXI9LWVDIjzRgUvsYpTfWREIlzbT+j5qxCO1k2usn1S/magkVzCRSJhPbMVw6X2K+md1TN+57tqIX+zNG7qcinz4m7gZVLtZH2SV7Wpx1XKg0P5p9bZ29FRULtblbcQU/G66FyMgrKhrW8dWVyX7zL/j2MPj2lPitWjk4tWZVM6SaJqcnNCiOsQxS53x+B1n4hI9vNHbzLZpFxyOZHa8UkaLva9nH6l1lJoltVuoNfgeLR43hEFfE1WpIm9q/lVOKGwMucgACAAAAAAAAAAAAAAAAAAAAAKtkaj43MXg5FQgCsi2NdUQrxjlc3sVUPoEg/NdP6NmjEY05zud27/M3TrpRqCpQHR1X7npv3O8S1UstlPWlpKmtnSClhfNKvBrEupvqbIuYapE1qNIV5LI9EJmEy5sHcU+i3EnIi1FdTRdKIiuU2cGiyjaiLUYjO7+21E8SbQm0I0BLlPo5wCLe5k839yT7IhsIsr5cok1v4bSN1fzSIi+JN4TeEKta59tVquv0Jcy4MHxOpVNjQVD78LRqTEuJ5bw/1fScPhtyZq37jDqM+ZdpUVG1iyr0RMVSbSbSjqHJOYpkS2Gvbfm9yN8TYwaNMclRFlfTQ/JX3XuN9UaU6Bt0p8PqJF5K5WtTxNbUaU6538vh9Oz+45VXuUZsZs9qfRVJdFqMTaidEcf3NlBowwdlttU1Uqp0ORqeBytRpFzBNfVkgh/tx/dTWT5px6pvtMWqbLya/V8C4sYsk6HI+WqVLuo2vtzmkVfE9Xw5Tw1nrMwyFPmjVIclrKqdbzVM0i/rkVTyXpGs/ZrP6z8dfRSY3VPw1tqRZFWO3C3y+RrwDTcBIGiqe1RiFP0tY9E7U8yPzr9Gk2yzM+K9trA5E+llJbjNuPLSNBsc1PfbdLE13dbyOVO80pwI3EKGot7cbmdi/5OIp4ttMjV4cVFeFeLEa53Bqr9DKoVs57HblVCstXs3akTW2bu3l0b2VScmSN4KhWmJLE+N6tVF47l6TIponx2kVbXW2r0h1XNE5WSMRVTmefpj1lR7kRUTkPoUrGo2oW3NEVTwLpHrJIr15lBAmLIMezyhSfqVzu1TpDTZQj2WVcOb/ALKL27zcnJ556AAjIAAAAAAAAAAAAAAAAAAAAChEGkSDY5rkfbdLG1yeHkS+RlpTgRuJUM/xxOb2L/k1XrdOuFAB1dm9yjmGPLmKPqZoFljkj1HavFN97odZUaVKZt0psMkf0K+RE8iNgZmsSmIl3M2k/EZU/AoqeFeV1Vxq58/5jmVbVjIkXkyJvmhzZfuellWzvEawmsM+ozJjVVumxKd3yR1vA18k0sy3lke9elzrlq3RbKULhcH0ABVCoTetk3r0JvMuDCsRqfcUNRIi82xqBhgzK7Cq/DUYtbSSwJJ7Kvba5hkAAFAAADe5Kn9HzdQOvZHOVi/VFNEbHBEdHitNUquq2OVq3+pJ4ku/0oUjpcKpJmNVyxzKm7oVP8Ec0t4p9V6K3WS28lvPzHSZUqXsteJWv7FIohmSpRYpE323Khis+JTjGqInRSLdNyrdFLGuVrkVq2VDKbM1zXQz/l4OMRbXW3DkbaXyzOmVFdyPMAoFShcxus9qdK2AnbAo9lgNAy1rU0f/AGoZ540bNnRQM+GJqdx7HF55AARkAAAAAAAAAAAAAAAAAAAABQ4bShTa+GUtTb3T1RfrY7k5zP8ABt8oVaol1jVjk/8AshY61XqGwVKHZ3AAAKlAB6J+J6v5uXzJBw7RhA+milrMQk13NRzmRsSyfK9yO+Z0MGdsejo2U0dbbUSzXK1FVU6zNs/STE/Tu4dHOX47bSKaa3xyqnhYzYsrZaoUulDTMtzkffxUimfMuOzqqS4rVdTZVancYMtXUz++qJZf3vV3iTWf1nWf1NDsUy3hjbek0ENuTVbfuNfPpDy7AuqyoklVP6cSqRCBoauxzlnKmzBRxUlLTvYxj9dZJF3ru4IhxwBqIw1EYAAVQAADKpnxuTZval+SmKVIJvxZn8QyjVIqX2tIrk69W5DdLEsSLNJuRE3ExZWn9OyhR666yugViqvyuhD2J68dbNTOWyRPVu7nvMU/GKsR7td7ndK3LQDo2AAAe9CzaV9PH8UrE70PAzsDZtcfw9nxVMf/AHIQTuxNVjU6EsXDmDi8wAAgAAAAAAAAAAAAAAAAAAAAChrsw0/pWX66HjrQut1pv8jYlsrEkiexUujmqgWOvnoHpPEsM8kS8WOVvYeZ2egABQAAAqUAF+56b9zvEtVLLZQXbnpZfa6ekCwFV48CgAAAAAAAAAAAS3o3n2uVkjVb7GZze3f5kc5ohWnzNiMa8p3KnUu87XRZPrUdfTqvsyNen1S3kc5pCp9jmyd1rJKxj+45x8mI8s5gAHRsAAA2+U49rmvDW24TtXs3moOiyHHtM3Ua/DrO7EJPEniZQAcXnAAEAAAAAAAAAAAAAAAAAAAAAUAAEFZjh9GzHiENrIk7lT67/M1p0ukCDY5uqVtZJGMf3W8jmjtHHojgACqAAAAVa1XORrUVVVbIicwL4IJqqZsMEbpJHrZrWpdVO5wfRlNMxsuK1Wxvv2MaXcnWp0uU8tU+XcM29QjfS3s1ppHfkToTqOZzJpEqJZ30uDKkUTVss6pdXdV+CHPMzOIYzM8dKzR7l1rUSSle91vadK669imHXaM8InRfRJZqV3Xrp3kazYpiE71fLWzvd0rIpn4bm3GsLcmxrXvan5JfXRe0Ysaz+r8fyhiWAfiTNSan5TRpuTrTkaImTLmZqPNNG+CWNrJ2t/FhdvRU6U6UI/zplr/h/EUfToq0dRdY7/lXm3vLFpziSJ+pc2ADbYAAAAA7jRdPqYvVwL/5kKL2KNKMGpi9JPbdJCqX6l/yavINT6Pm2lbeyTa0a/VDptKcF8Poai3syqztT/Bz/wBMcsjUAHRsAAA6zRvHr5qR3wQPXwOTO20XR62OVUnwwW7VQzbiW4lEAHJ5wABAAAAAAAAAAAAAAAAAAAAAFAABGGlGDUxiln/qQq3sX/Jw5JOlSC9HQVCJ7MjmKvWifYjY614714AA00AAAdJkOgbXZpp1e3WZAjpXIvyTd32ObO10YK1MdqUX2lg9XtJPEnjc6S8ZlpKSHDYHqxalFWVU5tTdbvIyOz0oNemPUzlvqrT2RfqtziyVjxK8CpQGmmbhOJTYTicFbA5UdE66p0pzQljONLHi2UKiRiaysYk0a9G9F8CGrE0sRY8jJt9ypQ+tf9pzt1i3ULAcgdGwAAAABn4DP6NmDD5r21ahnjYk3SNDt8qOeie6lY/y8yJon7KZkicWuRU7SZswsSvyTUu461KkiddkUxbsMW7CFgAbbAAA5EgaKo71FfL0Na3vuR+STorjtRYhJ0ytTuM24zbjvgAcnAAAQAAAAAAAAAAAAAAAAAAAABQAAcnpHg2uVnSW91Mx3atvMiQmzOMC1OU8QjRLqkesn0VFIT6jpTjtTgADbYAABu8oYm3Csy008jtWJyrHIq8kVLeNjSAYzBPsJbz7l+TGcLZVUzdaelRzrJ+Ztt6IRLZUWypaxJuSs5w1dNHheJSoyoZ6scj1skickv0nvmPR9TYpK6rw6RtLUPW7mKn4bl6d3BTlE48liJx5KKgdLNkHMMUitbSNlS/tMeioZuHaNMVqXItbNDTM5oi6zuzgb2hdoaPLWBy49jEVKxq7Jqo6V3JrSSM+4jFhuWJKVi6slSiRRtTja6X7kNrhWC0OXcPWKihe+yXc6yK+RfMirN2JYjiuLulrqWamYz1YYpGqmqn3MfKWey0ScCg5lyJrJu4+J1dFoKlAAAAE04M7+I5Ggau9ZKLZr16tiFiXtHc22ylFGq+6kezvv5mLsXRE5qtcrV4tWxQy8Wh9GxeshtbZzvb/ANSmIbbAABUlLRhHq4BUPt7dQu/qRCLCXtHUWplSN3xyvXvMX4xfjqQAc3EAAQAAAAAAAAAAAAAAAAAAAABQAAY2Iw+k4bUw/wBSJze4gG1j6GXeiovAgPEoPRsUqoP6czm95ujrRigA6OgAAAB0eUMrvzDWq+a7aOFU2rk4uXoQmcekzj1j4BlfEsekR1MzZwNd607uCdXSpLuHU38HwtsNVXPnSJPWmmVEMDGsew3KWHsjRjUdqqkMEe69vBL8yK8bzHiOOzq+qmVI0X1YmrZrfpzOftnP2yS8Q0gYDRKrGTOqnputC26dpqH6VadHKkeFSOTkrpUTyI2BrSGtISbT6UsPe5EqKCeJOlrkd9jfUuN5ezJFsNtDPrblilSzuxSFCrXK1yORVRU4Ki2GkGkJJx7RrBI10+Dv2T037B6qrV6l5EeVdJU0FU6nqonwyxrZWuTedblnSBVYe5lLijnVFNwSRfbj+52WPYBQZswls0LmbZWa0E7fBfkTM18lMzHUOWR6bvaTl0lh71dLPQVklNUMVksTla5F6SxU10untdHSdG3mAABJui2fXwqsgVfYmRe1CMjutFlRq4lW03xwo/sW3mZtxm3GiznT+j5srm2sjn66fXeaI7DSXBssyslRPewNXsuhx4rxY4AA0oTPkaPZ5Rov1NV3aqkMLuJyytHsssYc3/27V7Uv5mLsX42oAObiAAIAAAAAAAAAAAAAAAAAAAAAoAABCmc6f0fNle1Esj5NdPqlyayJtJUGxzMklvfQtXs3Gq9dKdciCpQ6uoAe0VNJKl2oiJ0qBWipJa+thpIE1pJno1qEyr6Fk7LK7k2dOxOuR6/dVOL0c4KsmNyVsqIqUrLs/ct08LnvpOxZz6mnwuNyo2Nu0lROarwOUzmcQxb2cOKxLEanFa6SsqpFfLIvHkickQxQDq2AAAAAB2OQszOw2vbhtS+9JUO1WX/I9eH0U44ua5WuRzVVHIt0VORJjMYSYzCStJGANqKNuMQM/Fis2a3NnT9CM72JqwWpjzLlFm2s7bQrDLf4rWUhurgdS1k9O9LOikcxfopmv4zX8We8T9XiWFUVUXcX210untdHSbbeZ1GjqdIc2Rpw2sT2eC+Ry5uMpz+j5pw997IsyNX67iW4k8dTpVgtLh86JxRzFX6opHxKelCn18Ap5+cVQneikWErxK8AAaaLXsnST3hDNng1Ez4aeNP+lCCKdiyVMbE/M9EJ+pW6lJCz4Y2p3HO7nd6gAw5AACAAAAAAAAAAAAAAAAAAAAAKAAARxpVp/wDUYdUJ+Zr2Kv1RSRzitKFOsmB08yJ7mbj1pY1HWq9RaCp7Q0r5k1kVEb0qdXd5xtR8jWrzWxlVDpFkbBCipZORatHJGqPY5HKi3se7X7VNeNyNfazkchBI2jamSDBqiTWVz5JrKqr0J/k4POcrps2V7lXckmqnyREsSBo3aseAzNe67kqFVfqiEc5qRzc0YijuU6nOvyYj5NSADq2AAAAABUoAJO0W1KvwqrplX3cqOROtDj87U6U2bK1qJZHv2naiKb7RZMqYjXQ8nRNd9b2MLSXGjMzten56dqr9FVDEfJiPk5Arw4Aobbelkel03O5/M9KGVaevp5k3LHK13Yp4Iti5fXbu3PTvIJhzzClVlCqcm/URJUXq59hDZNU3/MciP5rLh/Pp1CFTNGKAANts7BI9rjdFH8U7E7yeGpZqJ0IQjlKLa5qw9v8AvIvYTec7dcrgAMOYAAgAAAAAAAAAAAAAAAAAAAACgAAHOZ9g2+UKxU4x6jk+jkOjMDHKZKzBKynXfrxL3b/Iqx1BDd6onSZ1Rr+pDFzTfY8K1WpMiNREsh7xTMmal36kiJa50ekRW0zUiRbyOU8Kpmzm3LxS6nskMcT1lll1l4oYs0iyyq5foWBIeiupV0eIU7lvZWOS/wBUObz9TrT5tqXcpUa/uPXR/izMNzCkUztWKqbs1VeS8U7931Oo0iZbmxGBmJ0cavmgbqysRN7m9KdW8xyznyyLwVVLKqLxTkU4HRsBVrXPWzUVy/LeZcWE4jP7mhqH36I1IMMqbuDJuYaj2MMkanS9Ub4myp9G2Oy22q08KfOS6p2DMJMw5EEgwaLJFt6RijW/KOK/ipt8N0cYRQztnqHy1jmb0R/qtv1JxJtCbQx9GuCzUdDNiM7FY6ps2NF+FN9+05LPeIMxDNE6xLdkCJCi9Kpx71O0zbnKmwmkfQ4dI19W5up6m9sScL9fyIpc5XuVzlu5y3VV5qSuZnKVic5UABtsKoqoqFABM+UJUrsmUqO3/hLGv03EPVcWxrZ4l/JI5vYpKOjOoSTLkkSrdYp3J9FspH2ZYNlmTEI0SypO5bdN1VTFesV61IKg226HIce0zdR7vZ1ndiEykSaOI9fNCO+CFyktnK3XK/QAGXMAAQAAAAAAAAAAAAAAAAAAAABQAqjbgEbctlRHsc225UsXq7kFS6biKgaqp0mc7V3PjVWqnUYCoqLZUNpjrX0GZK+JEtqzru69/ma6aXayK/VRDtHHeHmADSqoqo5FRbKnBUJIyrpAhdDHQ4y/UkYlm1C8Hfu3blI2BJjKTESmqpy3l3Gl9IdSwSudv2kT7X7FLWZYyxQJdaKlYqc5HX8VIdgrKqmS1PUzRJ0MerU7i2WonndeaaSRel7lUxrLOspndi+V8OTdU0EVuTERV7jEm0g5dg3MqXyW/pxLYh+yJwREA0NUnVGlLD2fy9BPKv6nI37mtqNKlW/dBhcUfzfKrvI4MGtIWKw6qfSNmCa6MlhiT9MSL4mrq8045XMVk+JTK13FrVRqL2IakqXWPpdYL3W68fmUAKoAVAoD1jpp5fdwyP8A2tVTOp8u4zUr+FhlS6/6FTxJkdhorm/8Rgv8D7dqGi0gw7DNs6pu2jGv7U+6HZZEyzU4FBPU1yIyeoRE2aLfVam/f8ziM9YhHiOaJ3xKjmQtSJFTnq3v3qpiPkxHtmi94n6vEs5lOZetpEv+bxOjbs9F7NbHql/w0/i5CUSNtFUd63EJLcI2N71JJOVuuN+gAMsAACAAAAAAAAAAAAAAAAAAAACyrwS4VVqXXeVc7fZA3cu/cFatyKrucnzLUu1SqNVN4fxAhvSDDss31TkSyStY/uOaO40oUj2YtTVaMXUki1FdbddF+xw52rx3rPgCp6R008q2jglev6WKppXkDZwZbxup9zhVU5OlY1TxNlT6P8wz21qVkN/6j0QmYTMOaB28Gi3E3b562mj/AGazvI2UOiult/qMSmVeezYieJNoTaEbAlmDRtgMK+utTN++RPJDaQZPy/T+zhcDlTm9NYm6TeIQmiK7gir1GTBheIVK/gUVRJf4Y1UnKPD6CkZeGigjt8ESX7kMKrzHS0SfyddJb+lSuUm6b54i2DJeYKi2rhsjE6XqjTYwaNcdmssj6aFP1PVfBDp6rSJDBdI8Gr1X/cj1TUVGlCvRVSHC4mJy2iuX7DNvpc2XU+iubd6TicaJz2bF8zZQaMMJj99VVUq9aN8jmJ9JGPy+ytND+yNb96mtnzdmCo9rFKhqdDHavgMWMWlJUORMt06evSJJbnJIqnt6FlTDkusOGxW5uRtyHp6+tqf5irnm/uSOd4ngty6msplfm3LFGitZWwbuUTL+CGBPpMwSJV2UdVNboYiJ3qRQBpBpDtcd0j1WIU76fD4FpY3oqOkct32+XQcWqqqqqqqqvFVKA1ERDURgK8N6FAVUlaLWXpa+a29Xtb2HenFaL49TAqh/xzr3IdtxOM9cLdUABGQABAAAAAAAAAAAAAAAAAAAVal1Lldbcha1bKHJZbkWFyLrblKKrm7i0KqqMKrrLcKt1uUBUYmJ4XR4vRupa2JJYl32uqKi9KKhoYtHWXI1u+mll+T5neR1ILlcy1VLlfBKNE2GHRNtwvd3ibGOCKJqNjja1E5Ih6AGZAARAAAAAAAAFFY13FqL1oeMlFSy+8p43dbUPcBWuly9hE/vMPhd9LGFLkjLcy3dhjb/ACe5PM3wLkzLln6O8uP9mlkZ+2Z33MeXRlgzvdy1Ef8A8r+J2IGZXaXCSaLKJfd4lM3rjRfMxZNFTkRdni6L+6D/APRIoGZNpRfLouxRt9lW0z+tHN+5jP0a4+32fRn9UtvFCWQXaV3lDsmj7McfCja/9srTwTJGYlkRi4bIl146zbeJNIG0m8tNlbBHYDgkVHI5HS3V8ipwuvJDcgGWc5V49ZQDiEAAEAAAAAAAAAAAAAAAAAABVnErfVVUUtRbKFW63GFOYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z`
        }
        style={{
          position: "absolute",
          opacity: props.editMode ? 0.75 : 1,
          width: isMobile ? '110px' : '130px',
            height: isMobile ? '110px' : '130px',
          border: "solid white 6px",
          borderRadius:"50%"
        }}
      />
      {props.editMode && (
        <Box style={{ position: "relative" }}>
          <div>
            <form>
              <label className="uptext" htmlFor="uploadProfileImage">
                <img
                  style={{
                    opacity: 0.45,
                    height: "120px",
                    width: "120px",
                    cursor: "pointer",
                  }}
                  src={LogoCamera}
                  alt="img"
                />
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                id="uploadProfileImage"
                name="uploadProfileImage"
                hidden={true}
                onChange={handleChangeImage}
              />
            </form>
          </div>
        </Box>
      )}
    </>
  );
};

export default ManageAdminProfilePicUpload;