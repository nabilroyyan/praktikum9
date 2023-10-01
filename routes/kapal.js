const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db");

router.get("/", function (req, res) {
  connection.query(
    "select id_kapal,nama_kapal, pemilik.nama_pemilik, dpi.nama_dpi, alat_tangkap.nama_alat_tangkap from kapal join pemilik on kapal.id_pemilik = pemilik.id_pemilik join dpi on kapal.id_dpi = dpi.id_dpi join alat_tangkap on kapal.id_alat_tangkap = alat_tangkap.id_alat_tangkap  ",
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server  error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data kapal",
          data: rows[0],
        });
      }
    }
  );
});

router.post(
  "/store",
  [
    body("nama_kapal").notEmpty(),
    body("id_pemilik").notEmpty(),
    body("id_dpi").notEmpty(),
    body("id_alat_tangkap").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error,
      });
    }
    let data = {
      nama_kapal: req.body.nama_kapal,
      id_pemilik: req.body.id_pemilik,
      id_dpi: req.body.id_dpi,
      id_alat_tangkap: req.body.id_alat_tangkap,
    };
    connection.query("insert into kapal set ?", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data kapal berhasil dibuat",
          data: rows[0],
        });
      }
    });
  }
);

router.get("/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `select * from kapal where id_kapal='${id}'`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      }
      if (rows.length <= 0) {
        return res.status(400).json({
          status: false,
          message: "not found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data ada",
          data: rows[0],
        });
      }
    }
  );
});

router.patch(
  "/update/:id",
  [
    body("nama_kapal").notEmpty(),
    body("id_dpi").notEmpty(),
    body("id_pemilik").notEmpty(),
    body("id_alat_tangkap").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let data = {
      nama_kapal: req.body.nama_kapal,
      id_dpi: req.body.id_dpi,
      id_pemilik: req.body.id_pemilik,
      id_alat_tangkap: req.body.id_alat_tangkap,
    };
    connection.query(
      `update kapal set ? where id_kapal = ${id}`,
      data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server error",
            error: err,
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "update data kapal",
          });
        }
      }
    );
  }
);

router.delete("/delete/:id", function (req, res) {
  let id = req.params.id;
  connection.query(
    `delete from kapal where id_kapal = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "hapus data kapal",
        });
      }
    }
  );
});

module.exports = router;
