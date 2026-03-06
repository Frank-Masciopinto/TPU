
-- Thread: How Fast Does Trailer Parts Unlimited Ship Orders?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'how-fast-trailer-parts-unlimited-shipping-delivery-time') THEN
    RAISE NOTICE 'Skipping: how-fast-trailer-parts-unlimited-shipping-delivery-time (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How Fast Does Trailer Parts Unlimited Ship Orders?',
    'how-fast-trailer-parts-unlimited-shipping-delivery-time',
    'How fast will I get my product after I order it? I''d like to know the typical turnaround time for shipping.',
    'Orders typically ship within 1-3 business days. You''ll receive an email with tracking information once your order ships.',
    '{shipping,delivery,orders}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'We try our best to get orders out next day, however if we''re busy we typically ship out 1-3 days after items are ordered. You will receive an email when your order ships and that email will have tracking information.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is the Offset on Standard Trailer Wheels?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-is-offset-on-standard-trailer-wheels-zero') THEN
    RAISE NOTICE 'Skipping: what-is-offset-on-standard-trailer-wheels-zero (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is the Offset on Standard Trailer Wheels?',
    'what-is-offset-on-standard-trailer-wheels-zero',
    'What is the offset of common trailer wheels? I want to make sure I''m getting the right fitment for my trailer.',
    'Most standard single trailer wheels have a zero (0) offset, meaning the wheel is centered with equal distance on both sides of the hub mounting surface.',
    '{wheels,offset,trailer-wheels,fitment}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Zero offset is the most common on all single trailer wheels. That means the wheel is centered in the middle, so you have the same distance both forward and backward on the hub — or in other words, in and out of the hub. This is standard across most trailer wheel sizes.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Al-Ko K08-490-90 Hub Drum Replacement Cross Reference for 10K Axles
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'alko-k08-490-90-hub-drum-replacement-10k-axle-cross-reference') THEN
    RAISE NOTICE 'Skipping: alko-k08-490-90-hub-drum-replacement-10k-axle-cross-reference (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Al-Ko K08-490-90 Hub Drum Replacement Cross Reference for 10K Axles',
    'alko-k08-490-90-hub-drum-replacement-10k-axle-cross-reference',
    'Do you have the K08-490-90 hub drum kit? I have a 10K heavy duty axle and need a compatible replacement.',
    'The K08-490-90 is an Al-Ko/Hayes 10K heavy duty hub drum kit. Rockwell part number 120865-1P475A is a direct replacement with 8x6.5" bolt pattern and 5/8" studs.',
    '{hub-drum,10k-axle,al-ko,cross-reference,rockwell}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, the part number you referenced is a hub drum kit — the K08-490-90 is for the Al-Ko and Hayes 10K heavy duty #120 spindle axle with electric or hydraulic brakes, 4.7" pilot and 5/8" studs x 18. The Al-Ko part number for the 4.75" hub and drum is 568273, and the 4.88" version is 568270. The Hayes part number for the 4.75" hub drum is 09080587. We stock the Rockwell 10K Heavy Duty Hub & Drum, part number 120865-1P475A (8x6.5" bolt pattern, 5/8" studs, hub drum only) or the 120865-1P475A-C which is the complete kit. This Rockwell hub and drum will directly replace the Al-Ko K08-490-90.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Lippert 295924 Seal Replacement for 12K to 16K Trailer Axles
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'lippert-295924-seal-replacement-12k-16k-trailer-axle') THEN
    RAISE NOTICE 'Skipping: lippert-295924-seal-replacement-12k-16k-trailer-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Lippert 295924 Seal Replacement for 12K to 16K Trailer Axles',
    'lippert-295924-seal-replacement-12k-16k-trailer-axle',
    'Do you have the Lippert 295924 seal? I need a replacement for my heavy duty trailer axle.',
    'The Lippert 295924 is a seal for 12K-16K trailer axles. The 10-56 seal is a direct cross-reference replacement.',
    '{seals,lippert,12k-axle,cross-reference}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, the Lippert 295924 is a seal for 12K through 16K trailer axles. You can use the 10-56 seal in place of the Lippert 295924 — it''s a direct replacement.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Is the CoPartner ST225/75R15 12-Ply Tire Good for Aluminum Trailers?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'copartner-st225-75r15-12-ply-tire-aluminum-trailer-review') THEN
    RAISE NOTICE 'Skipping: copartner-st225-75r15-12-ply-tire-aluminum-trailer-review (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Is the CoPartner ST225/75R15 12-Ply Tire Good for Aluminum Trailers?',
    'copartner-st225-75r15-12-ply-tire-aluminum-trailer-review',
    'Would the CoPartner ST225/75R15 12-ply trailer tire be suitable for an aluminum trailer? Or is the CoPartner tire more of a semi truck tire? I currently have Westlake 225/75R15 tires on my trailer.',
    'The CoPartner ST225/75R15 12-ply tire works great on aluminum trailers. It''s a heavy duty Load Range F all-steel tire that handles loads and road conditions better than standard options.',
    '{tires,st225-75r15,copartner,aluminum-trailer}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The CoPartner tire would work great on aluminum trailers. It''s a heavy duty tire, Load Range F, and it''s all steel construction so it''s going to handle your loads and road conditions much better and last quite a bit longer than a standard trailer tire. It''s an excellent upgrade from the Westlake tires.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can You Custom Build a Trailer Axle to My Specifications?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'custom-trailer-axle-order-build-to-spec-lead-time') THEN
    RAISE NOTICE 'Skipping: custom-trailer-axle-order-build-to-spec-lead-time (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can You Custom Build a Trailer Axle to My Specifications?',
    'custom-trailer-axle-order-build-to-spec-lead-time',
    'My trailer axle has a 41.5" spring center. Do you custom build axles to non-standard measurements?',
    'Custom trailer axles are available and typically take 3-7 weeks to manufacture. You''ll need to call in with your exact specifications to place a custom order.',
    '{custom-axle,special-order,trailer-axle}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, we do custom build trailer axles. Custom axles typically take 3-7 weeks to manufacture. We would need you to call us with your exact specifications so we can get the order placed correctly. If your spring center or hub face measurements don''t match our standard sizes, a custom order is the way to go.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Size Axles Does a Kaufman 20K Car Hauler Use?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'kaufman-car-hauler-20k-trailer-10k-axle-measurements') THEN
    RAISE NOTICE 'Skipping: kaufman-car-hauler-20k-trailer-10k-axle-measurements (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Size Axles Does a Kaufman 20K Car Hauler Use?',
    'kaufman-car-hauler-20k-trailer-10k-axle-measurements',
    'I have a Kaufman car hauler with 20K capacity. It has two 10,000 lb axles but I don''t know the measurements. What would the typical specs be?',
    'Most Kaufman car haulers with 10K axles use a 70" hub face with 42" spring center, but you should always measure your axle to confirm before ordering.',
    '{kaufman,car-hauler,10k-axle,trailer-axle,measurements}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'I see a lot of Kaufman trailers using the 10K axle with a 70" hub face and 42" spring center. But as always, I would recommend measuring your axle yourself to ensure we get you the correct replacement axles. The spring center measurement is especially important to get right.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Which Trailer Axle Measurement Matters Most: Spring Center or Hub Face
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'spring-center-vs-hub-face-most-important-trailer-axle-measurement') THEN
    RAISE NOTICE 'Skipping: spring-center-vs-hub-face-most-important-trailer-axle-measurement (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Which Trailer Axle Measurement Matters Most: Spring Center or Hub Face?',
    'spring-center-vs-hub-face-most-important-trailer-axle-measurement',
    'I have three Load Rite trailers that need new axles. The hub face measurements are all different but the spring centers are all 70". Does it matter that the hub faces are different, or does only the spring center measurement really matter?',
    'The spring center measurement is the most critical and must be exact since it determines how the axle bolts into your existing spring hangers. Hub face can vary slightly and still work fine.',
    '{spring-center,hub-face,measurements,trailer-axle}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The most important measurement is the spring center measurement — that has to be accurate. The hub face measurement can vary a little bit and still work out just fine, but the spring center needs to be exact so it will bolt back into your existing spring hangers that are welded on the trailer. Always get the spring center right first, then confirm the hub face is close.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Lippert 8K Torsion Axle Hub Drum 696104 for Kaufman Mini 5 Car Haulers
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'lippert-8k-torsion-axle-hub-drum-696104-kaufman-mini-5') THEN
    RAISE NOTICE 'Skipping: lippert-8k-torsion-axle-hub-drum-696104-kaufman-mini-5 (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Lippert 8K Torsion Axle Hub Drum 696104 for Kaufman Mini 5 Car Haulers',
    'lippert-8k-torsion-axle-hub-drum-696104-kaufman-mini-5',
    'I have a Lippert 8K torsion axle and need a hub for it. The bearings are the same size inner and outer, and the hub reads 696104. Can you help me find the right part?',
    'The 696104 casting is a special 8K brake hub drum for Lippert LCI torsion axles commonly found on Kaufman Mini 5 Car Haulers. It uses 25580 bearings for both inner and outer.',
    '{lippert,torsion-axle,8k-axle,hub-drum,kaufman}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'This is a special 8K Brake Hub Drum for the Lippert LCI Kaufman Mini 5 straight spindle trailer axle. Part number 696107 (casting number 696104). Here are the specs: 8,000 lb capacity, 12-1/4" x 3-3/8" brake drum size, fits Lippert LCI axle type A80-B-MINI5-TOR. It uses 25580 bearings for both the inner and outer — that''s what makes this hub special. The pilot is 4-7/8" ID, and the races come already pressed in. This brake hub is commonly found on Kaufman Mini 5 Car Haulers with torsion axles. This is a special straight spindle hub, so please confirm this matches your setup before ordering.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is the Backspacing on 17.5 Inch Trailer Wheels?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'backspacing-measurement-17-5-inch-trailer-wheels-negative-offset') THEN
    RAISE NOTICE 'Skipping: backspacing-measurement-17-5-inch-trailer-wheels-negative-offset (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is the Backspacing on 17.5 Inch Trailer Wheels?',
    'backspacing-measurement-17-5-inch-trailer-wheels-negative-offset',
    'What is the backspacing on the 17.5" trailer wheel with the -0.19 offset? I need to know the exact measurement.',
    'The backspacing on the 17.5" trailer wheel with -0.19 offset is 4-3/8", measured from the ground to the back of the wheel when placed flat with the hub face up.',
    '{wheels,17-5-inch,backspacing,offset}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The backspacing is 4-3/8". To measure this yourself, sit the wheel flat on the ground with the hub mounting surface facing up, stick a tape measure in the center hole, and measure from the ground to the back of the wheel where the hub mounts. That measurement should come out to 4-3/8" on the 17.5" wheel with the -0.19 offset.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Measurements Do I Need to Upgrade From 7K to 8K Axles?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-measurements-needed-upgrade-7k-to-8k-trailer-axles') THEN
    RAISE NOTICE 'Skipping: what-measurements-needed-upgrade-7k-to-8k-trailer-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Measurements Do I Need to Upgrade From 7K to 8K Axles?',
    'what-measurements-needed-upgrade-7k-to-8k-trailer-axles',
    'What information do I need to provide in order to upgrade from 7K to 8K trailer axles? I want to make sure I order the right size.',
    'To upgrade from 7K to 8K axles, the spring center to spring center measurement is the most important spec to provide. Hub face to hub face is helpful but the spring center alone is often enough to determine the right axle.',
    '{7k-axle,8k-axle,upgrade,measurements}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'We really just need to know the spring center to spring center measurement and the hub face to hub face measurement. But really, if you can provide us with the spring center measurement, we can typically figure out what you have based off that measurement alone. The spring center is the critical number for getting the upgrade right.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Dexter 9-123 Brake Drum Cross Reference for 9K and 10K Axles
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'dexter-9-123-brake-drum-cross-reference-9k-10k-axle') THEN
    RAISE NOTICE 'Skipping: dexter-9-123-brake-drum-cross-reference-9k-10k-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Dexter 9-123 Brake Drum Cross Reference for 9K and 10K Axles',
    'dexter-9-123-brake-drum-cross-reference-9k-10k-axle',
    'Do you have the Dexter drum 9-123 in stock? I need a replacement brake drum for my trailer axle.',
    'The Dexter 9-123 is a brake drum for 9K-10K axles manufactured after April 2023. The direct cross-reference replacement part number is TPU-8-430-5.',
    '{dexter,brake-drum,9k-axle,10k-axle,cross-reference}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The Dexter 9-123 is a trailer brake drum for 9K-10K axles made after April 2023. The Trailer Parts Unlimited part number that interchanges with the Dexter drum is TPU-8-430-5. This is a direct replacement — same specs, same fit.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Dexter Hub A-219 Cross Reference for 7K Trailer Axles
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'dexter-hub-a-219-cross-reference-7k-trailer-axle') THEN
    RAISE NOTICE 'Skipping: dexter-hub-a-219-cross-reference-7k-trailer-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Dexter Hub A-219 Cross Reference for 7K Trailer Axles',
    'dexter-hub-a-219-cross-reference-7k-trailer-axle',
    'Do you have a Dexter hub with the part number A-219? I need a replacement hub and drum for my 7K trailer axle.',
    'The Dexter A-219 is a 7K trailer hub and drum assembly with 1/2-inch studs. The direct cross-reference replacement part number is 90865A-17.',
    '{dexter,hub-drum,7k-axle,cross-reference}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The Dexter A-219 is a 7K trailer hub and drum with 1/2-inch studs. Our cross-reference part number is 90865A-17, which is a direct replacement that will fit your axle.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Timken Bearing 28682 Cross Reference Numbers for 12K Trailer Hubs
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'timken-bearing-28682-cross-reference-numbers-12k-trailer-hub') THEN
    RAISE NOTICE 'Skipping: timken-bearing-28682-cross-reference-numbers-12k-trailer-hub (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Timken Bearing 28682 Cross Reference Numbers for 12K Trailer Hubs',
    'timken-bearing-28682-cross-reference-numbers-12k-trailer-hub',
    'What is the cross-reference number for the Timken bearing 28682? I need to find a compatible replacement for my 12K trailer hub outer bearing.',
    'The Timken 28682 is the standard outer bearing for 12K trailer hubs with a 2.250-inch inner diameter. It cross-references with National Bearings 28682, SKF BR28682, and numerous other manufacturer part numbers.',
    '{timken,bearing,28682,12k-axle,cross-reference}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The Timken 28682 cross-references with the common bearing number 28682, which is the standard outer bearing for Dexter 12K hub assemblies measuring 2.250 inches inner diameter. Key cross-reference part numbers include: National Bearings 28682, SKF BR28682, Redneck Trailer Supplies 550401, Cummins 5086774AA, and Four Seasons 56643. Other industry cross-reference numbers include Lisle 53430, MSC Industrial 234011, and many OEM-specific numbers. This is a very widely available bearing and all cross-references are fully interchangeable.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How Wide Are the Leaf Springs on 15K and Heavy Duty Trailer Axles?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'leaf-spring-width-15k-12k-16k-heavy-duty-trailer-axles') THEN
    RAISE NOTICE 'Skipping: leaf-spring-width-15k-12k-16k-heavy-duty-trailer-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How Wide Are the Leaf Springs on 15K and Heavy Duty Trailer Axles?',
    'leaf-spring-width-15k-12k-16k-heavy-duty-trailer-axles',
    'How wide are the springs on 15K trailer axles? Are they the same width as springs on other heavy-duty axle capacities?',
    'Leaf springs on 15K trailer axles are 3 inches wide, the same width used on 12K, 16K, and some heavy-duty 10K axles. All Hutch suspension springs are also 3 inches wide regardless of capacity.',
    '{leaf-springs,15k-axle,spring-width,suspension}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The springs on 15K axles are 3 inches wide. They are the same width as 12K, 16K, and sometimes you will even see 10K heavy-duty axles with 3-inch wide leaf springs. However, if you''re using Hutch suspension, then all the Hutch suspension springs will be 3 inches wide regardless of the capacity axles you have.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Inside Brake Drum to Drum Measurement on 8K Axles With 82 Inch Hub Fac
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'inside-brake-drum-measurement-8k-axle-82-inch-hub-face') THEN
    RAISE NOTICE 'Skipping: inside-brake-drum-measurement-8k-axle-82-inch-hub-face (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Inside Brake Drum to Drum Measurement on 8K Axles With 82 Inch Hub Face',
    'inside-brake-drum-measurement-8k-axle-82-inch-hub-face',
    'What is the measurement from the inside brake drum to the other inside brake drum on the 8K trailer axles with an 82-inch hub face and 12-1/4 x 3-3/8 inch brakes?',
    'The inside brake flange to brake flange measurement on 82-inch hub face 8K trailer axles with 12-1/4 x 3-3/8 inch brakes is 69-1/2 inches.',
    '{8k-axle,brake-drum,measurements,hub-face}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The measurement from inside brake flange to inside brake flange on the 82-inch hub face 8K axles is 69-1/2 inches. This is an important measurement to verify when checking whether the axle will clear your trailer frame.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Trailer Axle Do I Need to Build a 102 Inch Wide Trailer?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-trailer-axle-for-102-inch-wide-trailer-build') THEN
    RAISE NOTICE 'Skipping: what-trailer-axle-for-102-inch-wide-trailer-build (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Trailer Axle Do I Need to Build a 102 Inch Wide Trailer?',
    'what-trailer-axle-for-102-inch-wide-trailer-build',
    'I''m looking for a trailer axle kit to build a 102-inch wide trailer. What size axle do I need for this width?',
    'For building a 102-inch wide trailer, you need a 95-inch hub face axle with an 80-inch spring center.',
    '{trailer-build,102-inch,trailer-axle,hub-face}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'For a 102-inch wide trailer, you would need the 95-inch hub face with 80-inch spring center trailer axles. This is the standard configuration for trailers at that width and keeps you within road-legal dimensions.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Are Trailer Hub and Drums EZ Lube or Standard Grease?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'are-trailer-hub-drums-ez-lube-or-standard-grease') THEN
    RAISE NOTICE 'Skipping: are-trailer-hub-drums-ez-lube-or-standard-grease (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Are Trailer Hub and Drums EZ Lube or Standard Grease?',
    'are-trailer-hub-drums-ez-lube-or-standard-grease',
    'Are the 7K hub and drums EZ lube hub and drums? I want to make sure I''m ordering the right type for my trailer axle setup.',
    'Hub and drums work for both EZ lube and standard grease axles. The spindle itself determines whether an axle is EZ lube, not the hub and drum.',
    '{hub-and-drum,ez-lube,grease,trailer-spindle}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The hub and drums are made for both EZ lube and standard grease axles. The hub and drum itself does not determine if the trailer axle is easy lube or not. What determines it is the trailer spindle itself. The trailer spindle will come with a grease zerk already built onto the spindle for you to easily grease up your bearings. So whether you have EZ lube spindles or standard spindles, the same hub and drum will work for either application.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is a Lippert 8K Hybrid Axle and Why to Avoid It
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'lippert-8k-hybrid-axle-380827-vs-real-8k-axle') THEN
    RAISE NOTICE 'Skipping: lippert-8k-hybrid-axle-380827-vs-real-8k-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is a Lippert 8K Hybrid Axle and Why to Avoid It',
    'lippert-8k-hybrid-axle-380827-vs-real-8k-axle',
    'I''m looking for a Lippert 8K hub drum with part number 380827. Do you have this in stock?',
    'The Lippert 380827 is a "hybrid" 8K hub drum that uses smaller 12"x2" brakes, essentially a glorified 7K axle. A true 8K axle uses 12-1/4" x 3-3/8" brakes and a 3-1/2" heavy duty axle tube.',
    '{8k-axle,hybrid-axle,lippert,hub-and-drum,carter}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'This is a hub and drum assembly for a "hybrid" 8K axle that has the 12" x 2" brake assemblies. The only real difference between this hub and a 7K hub and drum is that it uses the 02475 outer bearing, so they call this an 8K hybrid axle. Unfortunately, we do not support nor stock these axles as we feel this is nothing more than a glorified 7K axle that companies are charging you double the price for and calling them 8K axles. This is solely my opinion and my views on the 8K hybrid axles. If you would like a real 8K axle with 12-1/4" x 3-3/8" brakes and a 3-1/2" heavy duty axle tube, then check out Carter 8K trailer axles.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Do You Stock Torsion Axles or Are They Special Order?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'torsion-axles-special-order-lead-time') THEN
    RAISE NOTICE 'Skipping: torsion-axles-special-order-lead-time (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Do You Stock Torsion Axles or Are They Special Order?',
    'torsion-axles-special-order-lead-time',
    'Do you stock torsion axles? I need one for my trailer and want to know what the availability and lead time looks like.',
    'Torsion axles are not stocked due to the huge number of variations. They are special order only and typically take 4+ weeks to manufacture and deliver.',
    '{torsion-axle,special-order,lead-time,trailer-axle}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Unfortunately, we do not stock torsion axles. There are too many variances when it comes to torsion axles, and we would have to stock hundreds of different ones to even get close to guessing what you would need. We do sell them, however they are all special order and take 4+ weeks to get in. If you can get the serial number that''s engraved on the axle tube itself, typically in the middle, that would ensure we get you the exact axle you need. It should be around a 9-digit number.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Does an 8K Axle Have a Bigger Tube Than a 7K Trailer Axle?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = '8k-vs-7k-trailer-axle-tube-size-difference') THEN
    RAISE NOTICE 'Skipping: 8k-vs-7k-trailer-axle-tube-size-difference (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Does an 8K Axle Have a Bigger Tube Than a 7K Trailer Axle?',
    '8k-vs-7k-trailer-axle-tube-size-difference',
    'Does an 8K axle have a bigger axle tube than the 7,000 lb trailer axles? I''m trying to understand the structural differences between the two.',
    'A true 8K axle like Carter or Dexter has a larger 3-1/2" tube, while Lippert 8K axles only have a 3" tube — the same size as 7K axles.',
    '{8k-axle,7k-axle,axle-tube,carter,dexter}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'A real 8K axle like the Carter brand has a bigger tube, yes. Dexter also has a bigger 3-1/2" axle tube like the Carter axles do. The Lippert axles, however, only have a 3" axle tube, which is the same as 7K axles. This is an important distinction when you''re comparing 8K axles between brands — not all 8K axles are built the same.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can I Use 16 Inch Wheels on 8K Carter Axles With 5/8 Studs?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'can-i-use-16-inch-wheels-8k-carter-axles-5-8-studs') THEN
    RAISE NOTICE 'Skipping: can-i-use-16-inch-wheels-8k-carter-axles-5-8-studs (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can I Use 16 Inch Wheels on 8K Carter Axles With 5/8 Studs?',
    'can-i-use-16-inch-wheels-8k-carter-axles-5-8-studs',
    'Can I use 16" wheels on the 8K Carter axles that have 5/8" studs? I want to make sure the wheel size is compatible before I order.',
    'Yes, 8K Carter axles with 5/8" studs accept both 16" and 17.5" tire and wheel combos.',
    '{8k-axle,carter,16-inch-wheels,wheel-compatibility}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, you can run the 16" or 17.5" tire and wheel combos with the Carter 8K trailer axle. The 16" wheels and the 17.5" wheels both allow for either 9/16" or 5/8" studs, so you have flexibility in your tire and wheel setup.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Find the Right 6-Lug Brake Drum for an Older Trailer
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'finding-right-6-lug-brake-drum-older-trailer') THEN
    RAISE NOTICE 'Skipping: finding-right-6-lug-brake-drum-older-trailer (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Find the Right 6-Lug Brake Drum for an Older Trailer',
    'finding-right-6-lug-brake-drum-older-trailer',
    'I''m looking for a 6-lug brake drum for my trailer. It has a 12" diameter and 2" deep drum. It''s an older trailer and I can''t find the exact one. The last one I purchased had races that were too big. My spindle is 1" outer and 1-1/2" on the inner.',
    'Finding the correct 6-lug brake drum requires matching your spindle bearing sizes exactly. Non-standard spindle sizes may require a specialty drum or swapping to a more common hub/drum assembly.',
    '{brake-drum,6-lug,bearings,older-trailer}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'It sounds like you''re looking for a 6-lug, 12" x 2" brake drum that fits a spindle with a 1" outer bearing and 1-1/2" inner bearing. Based on your spindle size, you''ll likely need a drum that takes the following bearing set: Inner Bearing 25580 (1.750" inner diameter) and Outer Bearing 15123 (1.250" inner diameter). However, your spindle measurements (1" outer and 1-1/2" inner) don''t match the typical 6-lug brake drums commonly found. Standard 6-lug drums use bearings that fit 3.5K, 5.2K, and 6K axles. Possible solutions: 1) Confirm your bearings by checking the old drum or spindle for bearing numbers. 2) Check if you need an older or specialty drum. 3) Consider switching to a different hub/drum assembly to match more common bearing sizes.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Triple Axle Hanger Kit for Double Eye Leaf Springs
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'triple-axle-hanger-kit-double-eye-leaf-springs') THEN
    RAISE NOTICE 'Skipping: triple-axle-hanger-kit-double-eye-leaf-springs (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Triple Axle Hanger Kit for Double Eye Leaf Springs',
    'triple-axle-hanger-kit-double-eye-leaf-springs',
    'I''m looking for a triple axle hanger kit for double eye leaf springs. Do you have this available?',
    'Triple axle hanger kits can be assembled by purchasing two tandem hanger kits, which is often the cheaper route and provides spare hangers.',
    '{triple-axle,hanger-kit,leaf-springs,suspension}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, we sell triple axle hanger kits, however it''s not currently in a single kit form on our website. We can piece together a triple axle hanger kit for you, or you could also buy 2 of the tandem hanger kits like SKU# THK175DBI or APT5. This will also make a triple axle hanger kit with a few extra hangers you will not need. This option is also the cheaper route to go. It will also give you a couple extra hangers just in case you mess up on welding a hanger in place.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is the Minimum Overhang for 10K Trailer Axles?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'minimum-overhang-10k-trailer-axles-spring-center') THEN
    RAISE NOTICE 'Skipping: minimum-overhang-10k-trailer-axles-spring-center (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is the Minimum Overhang for 10K Trailer Axles?',
    'minimum-overhang-10k-trailer-axles-spring-center',
    'What''s the minimum overhang for the 10K trailer axles? I''m trying to figure out the maximum spring center I can use for my hub face measurement.',
    'The minimum overhang for Lippert 10K trailer axles is 19.75 inches per side. For example, a 92" hub face axle could use a maximum spring center of about 72.25 inches.',
    '{10k-axle,overhang,spring-center,axle-measurement}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The minimum overhang for the Lippert 10K trailer axles is 19.75 inches — that comes straight from our sales rep. So for example, if you have a 92" hub face axle, then you could use a spring center up to about 72.25 inches. This is important to keep in mind so that you don''t de-rate your axle by spreading the spring centers too far apart.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: 10K Brake Assemblies for Quality and Rockwell American Axles
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = '10k-brake-assemblies-quality-rockwell-american-axles') THEN
    RAISE NOTICE 'Skipping: 10k-brake-assemblies-quality-rockwell-american-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    '10K Brake Assemblies for Quality and Rockwell American Axles',
    '10k-brake-assemblies-quality-rockwell-american-axles',
    'Do you have brake assemblies for the 10K Quality axles? I need electric brakes and want to make sure they''re compatible with Rockwell American.',
    'Carter brake assemblies are fully compatible with Quality (Rockwell American) 10K axles. Part numbers 4738-L (left) and 4738-R (right) are the correct electric brake assemblies.',
    '{10k-axle,brake-assembly,rockwell-american,electric-brakes}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, we carry the brake assemblies for the Quality axles, also known as Rockwell American. The 10K electric brake assembly part numbers are as follows: 4738-L for the left hand electric brake assembly and 4738-R for the right hand electric brake assembly. These are direct replacements for your 10K Quality or Rockwell American trailer axles.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Choose the Right Trailer Hub Grease Cap by Lug Count
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'how-to-choose-right-trailer-hub-grease-cap-size') THEN
    RAISE NOTICE 'Skipping: how-to-choose-right-trailer-hub-grease-cap-size (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Choose the Right Trailer Hub Grease Cap by Lug Count',
    'how-to-choose-right-trailer-hub-grease-cap-size',
    'How would I know which trailer hub grease cap I need? I''m not sure what size to order for my trailer hubs.',
    'Trailer hub grease cap size is determined by the number of lugs: 5-lug hubs use a 1.98" cap, 6-lug hubs use a 2.44" cap, and 8-lug hubs use a 2.72" cap.',
    '{grease-cap,hub,trailer-maintenance,lug-pattern}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The easiest way to determine which grease cap you need is by counting the number of lugs on your trailer hub: 5-Lug Hubs (2K-3.5K axles) use a 1.98" outer diameter grease cap (Part# TPU21-41). 6-Lug Hubs (5.2K-7K axles) use a 2.44" outer diameter grease cap (Part# TPU21-42). 8-Lug Hubs (8K+ axles) use a 2.72" outer diameter grease cap (Part# TPU21-43). Just count your lugs and match the diameter.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Complete 10K Trailer Axle Kits With Tires and Wheels
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'complete-10k-trailer-axle-kit-tires-wheels') THEN
    RAISE NOTICE 'Skipping: complete-10k-trailer-axle-kit-tires-wheels (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Complete 10K Trailer Axle Kits With Tires and Wheels',
    'complete-10k-trailer-axle-kit-tires-wheels',
    'I have a trailer with 10K axles and need to get them replaced. Do you have a whole 10K axle kit that comes complete with tires and wheels?',
    'Complete 10K trailer axle kits are available with everything needed for installation, including optional tire and wheel combos. Hub face and spring center measurements are required to order.',
    '{10k-axle,axle-kit,tires-wheels,trailer-axle}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, we sell 10K trailer kits that come complete with everything you need to install axles on your trailer, with optional tire and wheel combos included. The information we need from you is the hub face to hub face measurement and the spring center to spring center measurement in order to know which axles you need.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Carry-On Trailer 504T Leaf Spring Cross Reference Replacement
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'carry-on-trailer-504t-leaf-spring-cross-reference') THEN
    RAISE NOTICE 'Skipping: carry-on-trailer-504t-leaf-spring-cross-reference (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Carry-On Trailer 504T Leaf Spring Cross Reference Replacement',
    'carry-on-trailer-504t-leaf-spring-cross-reference',
    'I have a Carry-On trailer and need new suspension springs. I have a part number for the springs — it''s 504T. Do you have a replacement?',
    'The Carry-On 504T is a 25-1/4" double eye leaf spring with 3 leaves. A direct replacement with upgraded 4-leaf construction is available under part number TPU-212.',
    '{leaf-spring,carry-on-trailer,suspension,cross-reference}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The part number you provided is a Carry-On 25-1/4" double eye leaf spring with 3 leaves, part #504. We have a 4-leaf double eye spring that has the same specs, and our part number is TPU-212. The extra leaf actually gives you a little more capacity and durability compared to the original 3-leaf spring, while still being a direct bolt-on replacement.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Determine Hub Face From Backing Plate Measurement
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'determine-hub-face-from-backing-plate-measurement') THEN
    RAISE NOTICE 'Skipping: determine-hub-face-from-backing-plate-measurement (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Determine Hub Face From Backing Plate Measurement',
    'determine-hub-face-from-backing-plate-measurement',
    'I measured 86 inches from backing plate to backing plate and 80 inches spring center on my 7K axle. Would that be a 95" hub face?',
    'On a 7K brake axle, an 86" backing plate to backing plate measurement corresponds to a 95" hub face.',
    '{hub-face,backing-plate,axle-measurement,7k-axle}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'I went and measured a 7,000 lb brake axle and yes, the measurement from backing plate to backing plate (or brake flange to brake flange) is 86" on a 95" hub face axle. So yes, you have a 95" hub face with 80" spring center. This is a useful trick — if you can''t easily measure hub face directly, you can measure backing plate to backing plate and use that to confirm your hub face dimension.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Dexter 12K Hub Assembly Cost vs Buying a Complete Axle
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'dexter-12k-hub-assembly-cost-vs-complete-axle') THEN
    RAISE NOTICE 'Skipping: dexter-12k-hub-assembly-cost-vs-complete-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Dexter 12K Hub Assembly Cost vs Buying a Complete Axle',
    'dexter-12k-hub-assembly-cost-vs-complete-axle',
    'I need a Dexter 12K hub assembly. I have the part number 8-214-5-UC1. Do you have this in stock and what''s a reasonable price?',
    'Individual 10K/12K Dexter hub assemblies can cost $450+ each. A complete 10K electric brake axle fully assembled sells for around $1,000, making full axle replacement a cost-effective alternative.',
    '{12k-axle,10k-axle,hub-assembly,dexter,cost-comparison}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The part number 8-214-5-UC1 is actually for a 10K heavy duty Dexter trailer hub. Unfortunately, as of this time we do not stock these individually. I see them online ranging from $450 and up per hub. We do, however, sell a whole 10K electric brake axle fully assembled and ready to install with electric brakes and hub drums on them for only $1,000 each. So that might be another option to consider — in many cases, it makes more financial sense to replace the entire axle.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Lippert 122-094 Brake Drum Cross Reference for 6K Axles
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'lippert-122-094-brake-drum-cross-reference-6k-axles') THEN
    RAISE NOTICE 'Skipping: lippert-122-094-brake-drum-cross-reference-6k-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Lippert 122-094 Brake Drum Cross Reference for 6K Axles',
    'lippert-122-094-brake-drum-cross-reference-6k-axles',
    'I have a Lippert brake drum with 122-094 stamped in it. Do you have a replacement for this?',
    'The Lippert 122-094 is a 6-lug hub and drum for 6,000 lb trailer axles. Direct replacements are available in stock.',
    '{lippert,brake-drum,6k-axle,cross-reference,hub-and-drum}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The number 122-094 stamped in your brake drum identifies it as a 6-lug hub and drum for 6,000 lb trailer axles. We have this in stock and it''s a standard replacement item.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Do Dexter and Lippert 10K and Larger Axle Parts Interchange?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'dexter-lippert-10k-larger-axle-parts-interchange') THEN
    RAISE NOTICE 'Skipping: dexter-lippert-10k-larger-axle-parts-interchange (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Do Dexter and Lippert 10K and Larger Axle Parts Interchange?',
    'dexter-lippert-10k-larger-axle-parts-interchange',
    'I see where the smaller axle components interchange between Dexter and Lippert axles. What about the larger 10K and above axles — do they interchange too?',
    'Dexter and Lippert components on 10K+ axles are interchangeable as long as measurements match, including bearing sizes and brake dimensions.',
    '{dexter,lippert,10k-axle,interchangeability}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'You''re not going to have any problems mixing Dexter and Lippert components on trailer axles over 10K lbs in the same manner as below 10K lbs, as long as the measurements on the replacement parts are the same — meaning bearing sizes are the same, brake dimensions match, etc. This happens quite often in our shop repairs where we''ll use Dexter brakes on a Lippert axle. When doing this, make sure that you''re using the correct capacity components with parts that match their applications.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Cross Reference a Trailer Grease Seal by Part Number
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'cross-reference-trailer-grease-seal-part-number') THEN
    RAISE NOTICE 'Skipping: cross-reference-trailer-grease-seal-part-number (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Cross Reference a Trailer Grease Seal by Part Number',
    'cross-reference-trailer-grease-seal-part-number',
    'I have a number on a grease seal — it reads TCM171255TB. Can you tell me if you have a replacement for it?',
    'The TCM171255TB grease seal is for 3,500 lb trailer axles. The cross-reference replacement part number is 10-19.',
    '{grease-seal,cross-reference,3500-lb-axle,trailer-maintenance}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'That seal number, TCM171255TB, is a grease seal for 3,500 lb trailer axles. Our cross-reference part number is 10-19. When looking up trailer grease seals, the numbers stamped on the seal itself can often be cross-referenced to standard trailer part numbers.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Trailer Hub Leaking Oil: Bearing Failure Causes and Prevention Tips
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'trailer-hub-leaking-oil-bearing-failure-causes-prevention') THEN
    RAISE NOTICE 'Skipping: trailer-hub-leaking-oil-bearing-failure-causes-prevention (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Trailer Hub Leaking Oil: Bearing Failure Causes and Prevention Tips',
    'trailer-hub-leaking-oil-bearing-failure-causes-prevention',
    'My trailer hub is leaking oil and the seal blew out after about a year of use. The bearings appear damaged. Is this a warranty issue, and what could have caused this failure?',
    'Hub oil leaks and seal blowouts are typically caused by bearing failure from oil starvation or heat buildup, not product defects. Regular oil level checks, seal inspections, heat monitoring, and staying within load ratings are essential to prevent catastrophic hub failure.',
    '{trailer-hubs,oil-bath,bearings,maintenance,seals}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'After reviewing the damage, this is consistent with a complete bearing failure caused by oil starvation or heat-related breakdown. In oil-lubricated hubs, maintaining the correct oil level and regularly checking the cap for leaks or cracks is absolutely critical. If the hub runs low on oil or if water contamination occurs, the bearings can overheat and fail — leading to internal damage and, in severe cases, total hub separation. This type of failure doesn''t happen overnight and is not related to any product defect. It''s most often the result of missed maintenance or running the trailer under load for extended periods without proper inspection. To avoid this: Check oil levels regularly especially before long hauls. Inspect oil caps and seals for damage. Monitor hub temperature periodically. Stay within load ratings. This is avoidable with the right maintenance schedule.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can You Switch From Oil to Grease on 10K and 12K Trailer Axles?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'switch-oil-to-grease-10k-12k-trailer-axles') THEN
    RAISE NOTICE 'Skipping: switch-oil-to-grease-10k-12k-trailer-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can You Switch From Oil to Grease on 10K and 12K Trailer Axles?',
    'switch-oil-to-grease-10k-12k-trailer-axles',
    'I have 10K and 12K trailer axles that currently use oil bath lubrication. If I want to switch to grease instead, do I need to buy a different seal or any additional parts?',
    'Switching from oil to grease on 10K and 12K trailer axles is simple — just drain the oil and pack with grease. The seal is the same for both oil and grease applications.',
    '{oil-bath,grease,10k-axle,12k-axle,trailer-hubs}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Simply drain the oil and pack the bearings with grease. The seal is the same for both oil and grease applications on 10K and 12K axles. No additional parts are needed — it''s an easy and straightforward swap. Just make sure you thoroughly clean out the old oil before packing with grease, and use a high-quality bearing grease rated for trailer use.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Identify Old Style vs New Style Dexter 10K Trailer Hubs
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'old-style-vs-new-style-dexter-10k-trailer-hub-identification') THEN
    RAISE NOTICE 'Skipping: old-style-vs-new-style-dexter-10k-trailer-hub-identification (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Identify Old Style vs New Style Dexter 10K Trailer Hubs',
    'old-style-vs-new-style-dexter-10k-trailer-hub-identification',
    'I need to replace the hub on my trailer but I''m not sure what capacity it is or whether it''s an old style or new style Dexter hub. How can I tell the difference?',
    'Old style Dexter 10K hubs can be identified by their checker-plated pattern and skinnier drum profile. The 10K drum uses 3-3/8 inch wide brakes, while the deeper 12K drum uses 5-inch brakes.',
    '{dexter,10k-axle,trailer-hubs,identification}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Here''s how to identify whether you have an old style 10K Dexter hub or something else. First, check the part number stamped on the drum — for example, a 9-44 stamp is a Dexter 9K-10K drum part number. Even without a visible part number, you can identify the hub by its appearance. Old style 10K hubs have what''s called a checker-plated pattern on them. This is only found on old style 10K hubs or newer 12K axle hubs. To distinguish between the two, look at the drum: the 10K drum is skinnier because it uses a 3-3/8 inch wide brake, while the 12K drum is much deeper because it uses a 5-inch wide brake. Checker-plated hub plus skinnier drum equals old style 10K. Checker-plated hub plus deeper drum equals 12K.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Does Tandem Mean in Trailer Axle Terminology?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-does-tandem-mean-trailer-axle-terminology') THEN
    RAISE NOTICE 'Skipping: what-does-tandem-mean-trailer-axle-terminology (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Does Tandem Mean in Trailer Axle Terminology?',
    'what-does-tandem-mean-trailer-axle-terminology',
    'I keep seeing the word "tandem" when shopping for trailer axle kits and hanger kits. What exactly does tandem mean in trailer terminology?',
    'In trailer terminology, tandem simply means two. A tandem axle trailer kit includes two axles, and a tandem axle hanger kit includes all the suspension hardware needed for a two-axle setup.',
    '{trailer-terminology,tandem-axle,suspension}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Tandem means two. So when you see a "tandem axle trailer kit," it means you are getting two axles. Similarly, if you''re ordering a tandem axle hanger kit, that means it includes everything you need for a two-axle trailer setup. You''ll also hear "triple axle" for three-axle setups. But tandem is by far the most common configuration for utility, car hauler, and equipment trailers.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Will Carter 8K Brakes Fit 7200 lb Dexter Trailer Axles?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'carter-8k-brakes-fit-7200-lb-dexter-trailer-axles') THEN
    RAISE NOTICE 'Skipping: carter-8k-brakes-fit-7200-lb-dexter-trailer-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Will Carter 8K Brakes Fit 7200 lb Dexter Trailer Axles?',
    'carter-8k-brakes-fit-7200-lb-dexter-trailer-axles',
    'I have a 7200 lb Dexter trailer axle and need replacement brake assemblies. The Dexter part number I have is K23-429-00. Will Carter 8K brakes work as a replacement?',
    'Carter 8K brake assemblies (12-1/4 x 2-1/2 inch) are designed to fit both the new style 8K Dexter axles and 7200 lb Dexter axles, which share the same brake size.',
    '{brakes,dexter,carter,8k-axle,cross-reference}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'That Dexter part number is a 7200 lb brake assembly. Our Carter 8K brake assemblies — part number KC23-623 (right hand) and KC23-622 (left hand) — are 12-1/4 inch x 2-1/2 inch, made specifically for the new style 8K Dexter axles with the skinny brake as well as 7200 lb Dexter axles, which also use the same 12-1/4 x 2-1/2 inch brake size. So yes, the Carter brand will interchange perfectly and fit your 7200 lb Dexter axle. All Carter brake assemblies are self-adjusting, so you don''t have to manually adjust them after installation.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Carter Aluminum Oil Cap Replacement for Dexter 10K Plastic Caps
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'carter-aluminum-oil-cap-replace-dexter-10k-plastic-cap') THEN
    RAISE NOTICE 'Skipping: carter-aluminum-oil-cap-replace-dexter-10k-plastic-cap (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Carter Aluminum Oil Cap Replacement for Dexter 10K Plastic Caps',
    'carter-aluminum-oil-cap-replace-dexter-10k-plastic-cap',
    'I have a 2021 model trailer with Dexter 10K axles and the factory plastic oil cap (part number 21-88). Does the Carter forged aluminum oil cap fit as a direct replacement?',
    'The Carter 10K forged aluminum oil cap (KC21-302) is a direct replacement for the Dexter 21-88 plastic oil cap, Dexter Fortress caps, and Valcrum caps.',
    '{oil-caps,dexter,carter,10k-axle,upgrades}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, the Carter 10K forged aluminum oil cap fits and replaces the Dexter part number 21-88 plastic oil cap perfectly. The correct Carter part number is KC21-302. This aluminum oil cap also replaces the Dexter Fortress caps and Valcrum caps. The forged aluminum construction is significantly more durable than the factory plastic caps and provides a better, longer-lasting seal. It''s a direct bolt-on replacement — no modifications needed.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Why Are Trailer Tires Listed by Specs Instead of Brand Name?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'why-trailer-tires-listed-by-specs-not-brand-name') THEN
    RAISE NOTICE 'Skipping: why-trailer-tires-listed-by-specs-not-brand-name (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Why Are Trailer Tires Listed by Specs Instead of Brand Name?',
    'why-trailer-tires-listed-by-specs-not-brand-name',
    'I noticed your website doesn''t list specific tire brand names on the trailer tires you sell. Why is that?',
    'Trailer tire manufacturers sometimes stamp different brand names on the same tire across production runs. Tires are listed by specifications instead of brand to avoid confusion.',
    '{trailer-tires,tire-brands,specifications}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Because the manufacturer doesn''t always send us the same brand name tire. They are the exact same tire but stamped with different names at times when we receive them from the factory. Rather than listing a brand and having customers think they received the wrong product, we list tires by their specifications — size, load range, ply rating, and construction type. The tires come from the same factory, are rated for the same weight, are the same size, and have the same specs. The only difference is the name branded on the sidewall.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Will 8K Trailer Axles Fit My Frame? Backing Plate Clearance Guide
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = '8k-trailer-axle-backing-plate-clearance-frame-width-guide') THEN
    RAISE NOTICE 'Skipping: 8k-trailer-axle-backing-plate-clearance-frame-width-guide (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Will 8K Trailer Axles Fit My Frame? Backing Plate Clearance Guide',
    '8k-trailer-axle-backing-plate-clearance-frame-width-guide',
    'I want to purchase an 8K tandem axle kit but need to make sure the axles are wide enough to fit my trailer. My frame is 83 inches wide. What are the backing plate to backing plate measurements on the 95-inch and 97-inch hub face 8K axles?',
    'For an 83-inch wide trailer frame, the 97-inch hub face 8K axle with 80-inch spring center is the recommended choice. The 95-inch hub face 8K axle measures 83-3/8 inches backing plate to backing plate.',
    '{8k-axle,frame-width,backing-plate,measurements}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Typically, if you have an 83-inch frame, you would use an 80-inch spring center. In that case, you would need to purchase the 8K axle with the 97-inch hub face. If you purchased the 95-inch hub face axle instead, the brake flange to brake flange measurement is 85-1/4 inches, and the actual backing plate to backing plate (the measurement that matters for frame clearance) is 83-3/8 inches. So with an 83-inch frame, the 95-inch hub face 8K axle would be extremely tight. The 97-inch hub face with 80-inch spring center would be the safer choice.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Complete Trailer Axle Maintenance Schedule: Bearings, Brakes, and More
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'trailer-axle-maintenance-schedule-bearings-brakes-complete-guide') THEN
    RAISE NOTICE 'Skipping: trailer-axle-maintenance-schedule-bearings-brakes-complete-guide (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Complete Trailer Axle Maintenance Schedule: Bearings, Brakes, and More',
    'trailer-axle-maintenance-schedule-bearings-brakes-complete-guide',
    'I just purchased new Carter trailer axles. Do you have a recommended maintenance schedule for them, like when to add oil, repack bearings, and general upkeep?',
    'Trailer axle maintenance requires checking bearings and lubrication every 6-12 months or 3,000-12,000 miles, with more frequent service for heavy use or marine environments.',
    '{maintenance,bearings,brakes,trailer-axle,lubrication}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Trailer axle maintenance requires checking bearings and grease every 6-12 months or 3,000-12,000 miles, with more frequent service for heavy use or marine environments. Monthly or before each trip: check tire pressure, tire wear, and lug nut torque. Every 3 months or 3,000 miles for heavy use: inspect brakes, grease hubs, and check for worn suspension parts. Every 6 months or 6,000 miles: inspect axle beam for damage, check for loose bolts, and check brake magnets and shoes. Annually or 12,000 miles: fully repack wheel bearings, inspect bearing condition, replace grease seals, and adjust brakes. Use high-quality grease and avoid mixing different types. Boat trailers require more frequent lubrication. For newly purchased trailers, check lug nuts and suspension bolts after the first 50 miles of use.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Torque Specifications for Tandem Axle Hanger Kit Spring and Equalizer 
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'torque-specs-tandem-axle-hanger-kit-spring-equalizer-bolts') THEN
    RAISE NOTICE 'Skipping: torque-specs-tandem-axle-hanger-kit-spring-equalizer-bolts (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Torque Specifications for Tandem Axle Hanger Kit Spring and Equalizer Bolts',
    'torque-specs-tandem-axle-hanger-kit-spring-equalizer-bolts',
    'What are the torque specifications for the spring bolts and equalizer bolts on a tandem axle hanger kit with 2-inch wide slipper springs?',
    'For tandem hanger kits with 2-inch slipper springs, equalizer and spring eye bolts should be torqued to 30-50 ft-lbs, while U-bolts range from 35-90 ft-lbs depending on diameter.',
    '{torque-specs,suspension,tandem-axle,hanger-kit,installation}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'For a tandem hanger kit with 2-inch wide slipper springs (typically 3,500-8,000 lb axles), the primary pivot bolts should be torqued to 30-50 ft-lbs. Equalizer/center bolts (7/8 inch or 1 inch bolts): 30-50 ft-lbs, ensure components do not bind. Spring eye/shackle bolts (9/16 inch bolts): 30-50 ft-lbs. U-bolts (axle to springs): 35-90 ft-lbs depending on diameter. If using wet bolts or standard nuts, ensure they are tight but allow for suspension movement. If using locking nuts, they should be tight against the hanger. Use a wrench to hold the bolt head to prevent rotation while tightening. Ensure the equalizer moves freely after tightening. Check torque annually.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;
