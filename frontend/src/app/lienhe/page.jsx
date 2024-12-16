export default function Lienhe() {
    return(
      <>
  <div className="containerlh my-5">
      <div className="row">
          <div className="col-md-6">
              <h2 style={{marginLeft:'30px'}}>Liên Hệ Với Chúng Tôi</h2>
              <ul className="list-unstyled">
                  <li>
                  <i className="bi bi-globe-americas"></i>
                      <strong>Địa Chỉ:</strong>Tân Phước, Tân Hồng, Đồng Tháp, Việt Nam
                  </li>
                  <li>
                  <i className="bi bi-telephone"></i>
                      <strong>WhatsApp:</strong> +84 9111918807
                  </li>
                  <li>
                  <i className="bi bi-envelope"></i>
                      <strong>Email:</strong> hominhtri0712@gmail.com, hidan04@gmail.com
                  </li>
                  <li>
                  <i className="bi bi-stopwatch"></i>
                      <strong>Giờ Hoạt Động:</strong> Thứ Hai - Thứ Sáu: 9:00-20:00 <br/> Thứ Bảy: 11:00 - 15:00
                  </li>
              </ul>
          </div>
          <div className="col-md-6">
              <h2>Liên Lạc</h2>
              <form>
                  <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Tên của bạn..."/>
                  </div>
                  <div className="mb-3">
                      <input type="email" className="form-control" placeholder="Email của bạn..."/>
                  </div>
                  <div className="mb-3">
                      <input type="text" className="form-control" placeholder="Chủ đề"/>
                  </div>
                  <div className="mb-3">
                      <textarea className="form-control" rows="4" placeholder="Tin nhắn của bạn..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-warning">Gửi</button>
              </form>
          </div>
      </div>
      <div classNameName="row mt-5" style={{marginTop: "100px"}}>
          <div classNameName="col-12">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2837.1078913405545!2d105.51184840881879!3d10.820276889286681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a4ec53ad73bf7%3A0x9637f7dd56be216d!2zQ2jhu6MgR2nhu5NuZyBHxINuZw!5e1!3m2!1svi!2s!4v1731158139233!5m2!1svi!2s"
            width="50%"
            height="500"
            style={{ border: 0,marginLeft:'400px'}}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
      </>
    )
  }