;; Thought Quantization Contract

(define-map thoughts uint
  { content: (string-utf8 256),
    creator: principal,
    quantity: uint })

(define-data-var next-thought-id uint u0)

(define-public (quantize-thought (content (string-utf8 256)) (quantity uint))
  (let ((new-id (+ (var-get next-thought-id) u1)))
    (var-set next-thought-id new-id)
    (map-set thoughts new-id
      { content: content,
        creator: tx-sender,
        quantity: quantity })
    (ok new-id)))

(define-read-only (get-thought (id uint))
  (ok (map-get? thoughts id)))

(define-public (transfer-thought (id uint) (recipient principal) (amount uint))
  (let ((thought (unwrap! (map-get? thoughts id) (err u404))))
    (asserts! (is-eq (get creator thought) tx-sender) (err u403))
    (asserts! (<= amount (get quantity thought)) (err u401))
    (map-set thoughts id
      (merge thought { quantity: (- (get quantity thought) amount) }))
    (ok true)))

