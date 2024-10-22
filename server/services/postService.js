// const db = require("../config/db");

// exports.fetchPostsFeed = (userId) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT
//           p.id AS postId,
//           p.post_description,
//           p.img_path,
//           p.img_upload_time,
//           IFNULL(l.likeCount, 0) AS total_likes,
//           IFNULL(c.commentCount, 0) AS total_comments,
//           CASE
//               WHEN ul.userId IS NOT NULL THEN TRUE
//               ELSE FALSE
//           END AS userLiked,
//           u.id AS userId,       -- User ID of the post creator
//           u.name AS userName,   -- Name of the post creator
//           u.ProfilePic_path     -- Profile picture path of the post creator
//       FROM posts p
//       LEFT JOIN (
//           SELECT postId, COUNT(*) AS likeCount
//           FROM likes
//           GROUP BY postId
//       ) l ON p.id = l.postId
//       LEFT JOIN (
//           SELECT post_id, COUNT(*) AS commentCount
//           FROM comments
//           GROUP BY post_id
//       ) c ON p.id = c.post_id
//       LEFT JOIN likes ul ON p.id = ul.postId AND ul.userId = ?
//       LEFT JOIN users u ON p.user_id = u.id   -- Join to get user info
//       ORDER BY p.img_upload_time DESC         -- Order by latest post
//     `;

//     db.query(query, [userId], (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };

const db = require("../config/db");

exports.fetchPostsFeed = (userId, page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit; // Calculate offset based on page number
    const query = `
      SELECT 
          p.id AS postId,
          p.post_description,
          p.img_path,
          p.img_upload_time,
          IFNULL(l.likeCount, 0) AS total_likes,
          IFNULL(c.commentCount, 0) AS total_comments,
          CASE 
              WHEN ul.userId IS NOT NULL THEN TRUE
              ELSE FALSE
          END AS userLiked,
          u.id AS userId,
          u.name AS userName,
          u.ProfilePic_path
      FROM posts p
      LEFT JOIN (
          SELECT postId, COUNT(*) AS likeCount
          FROM likes
          GROUP BY postId
      ) l ON p.id = l.postId
      LEFT JOIN (
          SELECT post_id, COUNT(*) AS commentCount
          FROM comments
          GROUP BY post_id
      ) c ON p.id = c.post_id
      LEFT JOIN likes ul ON p.id = ul.postId AND ul.userId = ?
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.img_upload_time DESC
      LIMIT ?                               -- Fetch 7 posts at a time
      OFFSET ?;                             -- Skip previously fetched posts
    `;

    db.query(query, [userId, limit, offset], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};
